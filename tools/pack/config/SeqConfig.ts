import fs from 'fs';
import path from 'path';
import Packet from '#/io/Packet.js';
import Js5Index from '#/js5/Js5Index.js';
import {
    CACHE_DIR,
    CACHE_OUT_DIR,
    CONFIG_DIR,
    loadNameToIdMap,
    readConfigFile,
    packGroupAuto,
    updateMasterIndex,
    updateChecksumTable,
    writeMasterIndex,
    writeChecksumTable,
} from '#tools/util/ConfigPackHelper.ts';

const PRE_MOVE: Record<string, number> = { delaymove: 0, delayanim: 1, merge: 2 };
const POST_MOVE: Record<string, number> = { delaymove: 0, abortanim: 1, merge: 2 };
const DUP_BEHAVIOR: Record<string, number> = { '0': 0, reset: 1, reset_loop: 2 };

function resolveEnum(val: string, map: Record<string, number>): number {
    if (map[val] !== undefined) return map[val];
    const n = parseInt(val, 10);
    return isNaN(n) ? 0 : n;
}

function resolveAnim(val: string): number {
    const m = val.match(/^anim_(\d+)$/);
    if (m) return parseInt(m[1], 10);
    const n = parseInt(val, 10);
    return isNaN(n) ? -1 : n;
}

function resolveObj(val: string, objNameToId: Map<string, number>): number {
    const id = objNameToId.get(val);
    if (id !== undefined) return id;
    const m = val.match(/^obj_(\d+)$/);
    return m ? parseInt(m[1], 10) : parseInt(val, 10) || 0;
}

function encodeSeq(lines: string[], animNameToId: Map<string, number>, objNameToId: Map<string, number>): Uint8Array {
    const buf = new Packet(new Uint8Array(4096));

    let framesCount = 0;
    let frames: number[] = [];
    let delays: number[] = [];
    const iframeMap = new Map<number, number>();
    let iframeCountField: number | null = null;
    let soundCountField: number | null = null;
    const frameSounds = new Map<number, { synth: number, loops: number, volume: number, alts: number[] }>();

    const scalarEmissions: Array<() => void> = [];

    let maxFrameIndex = 0;
    for (const line of lines) {
        const m = line.match(/^(frame|delay)(\d+)=/);
        if (m) {
            const idx = parseInt(m[2], 10);
            if (idx > maxFrameIndex) maxFrameIndex = idx;
        }
    }
    if (maxFrameIndex > 0) {
        framesCount = maxFrameIndex;
        frames = new Array(framesCount).fill(-1);
        delays = new Array(framesCount).fill(0);
    }

    for (const line of lines) {
        const eqIdx = line.indexOf('=');
        if (eqIdx === -1) continue;
        const rawKey = line.slice(0, eqIdx).trim();
        const val = line.slice(eqIdx + 1).trim();
        const key = rawKey.replace(/#\d+$/, '');

        let m: RegExpMatchArray | null;

        if ((m = rawKey.match(/^frame(\d+)$/))) {
            frames[parseInt(m[1], 10) - 1] = resolveAnim(val);
        } else if ((m = rawKey.match(/^delay(\d+)$/))) {
            delays[parseInt(m[1], 10) - 1] = parseInt(val, 10);
        } else if ((m = rawKey.match(/^iframe(\d+)$/))) {
            iframeMap.set(parseInt(m[1], 10) - 1, resolveAnim(val));
        } else if ((m = rawKey.match(/^synth(\d+)$/))) {
            const idx = parseInt(m[1], 10) - 1;
            const e = frameSounds.get(idx) ?? { synth: 0, loops: 0, volume: 0, alts: [] };
            e.synth = parseInt(val, 10);
            frameSounds.set(idx, e);
        } else if ((m = rawKey.match(/^loopcount(\d+)$/))) {
            const idx = parseInt(m[1], 10) - 1;
            const e = frameSounds.get(idx) ?? { synth: 0, loops: 0, volume: 0, alts: [] };
            e.loops = parseInt(val, 10);
            frameSounds.set(idx, e);
        } else if ((m = rawKey.match(/^volume(\d+)$/))) {
            const idx = parseInt(m[1], 10) - 1;
            const e = frameSounds.get(idx) ?? { synth: 0, loops: 0, volume: 0, alts: [] };
            e.volume = parseInt(val, 10);
            frameSounds.set(idx, e);
        } else if ((m = rawKey.match(/^synth_alt(\d+)$/))) {
            const idx = parseInt(m[1], 10) - 1;
            const e = frameSounds.get(idx) ?? { synth: 0, loops: 0, volume: 0, alts: [] };
            e.alts = val.split(',').filter(s => s.length > 0).map(s => parseInt(s, 10));
            frameSounds.set(idx, e);
        } else if (key === 'loops') {
            const v = parseInt(val, 10);
            scalarEmissions.push(() => { buf.p1(2); buf.p2(v); });
        } else if (key === 'walkmerge') {
            const wm = val.split(',').filter(s => s.length > 0).map(s => parseInt(s.replace('label_', ''), 10));
            scalarEmissions.push(() => { buf.p1(3); buf.p1(wm.length); for (const w of wm) buf.p1(w); });
        } else if (key === 'reachforward') {
            scalarEmissions.push(() => { buf.p1(4); });
        } else if (key === 'priority') {
            const v = parseInt(val, 10);
            scalarEmissions.push(() => { buf.p1(5); buf.p1(v); });
        } else if (key === 'replaceheldleft') {
            const v = val === 'hide' ? 65535 : resolveObj(val, objNameToId);
            scalarEmissions.push(() => { buf.p1(6); buf.p2(v); });
        } else if (key === 'replaceheldright') {
            const v = val === 'hide' ? 65535 : resolveObj(val, objNameToId);
            scalarEmissions.push(() => { buf.p1(7); buf.p2(v); });
        } else if (key === 'maxloops') {
            const v = parseInt(val, 10);
            scalarEmissions.push(() => { buf.p1(8); buf.p1(v); });
        } else if (key === 'preanim_move') {
            const v = resolveEnum(val, PRE_MOVE);
            scalarEmissions.push(() => { buf.p1(9); buf.p1(v); });
        } else if (key === 'postanim_move') {
            const v = resolveEnum(val, POST_MOVE);
            scalarEmissions.push(() => { buf.p1(10); buf.p1(v); });
        } else if (key === 'duplicatebehavior') {
            const v = resolveEnum(val, DUP_BEHAVIOR);
            scalarEmissions.push(() => { buf.p1(11); buf.p1(v); });
        } else if (key === 'field1993') {
            scalarEmissions.push(() => { buf.p1(14); });
        } else if (key === 'numiframes') {
            iframeCountField = parseInt(val, 10);
        } else if (key === 'numsounds') {
            soundCountField = parseInt(val, 10);
        }
    }

    for (const emit of scalarEmissions) emit();

    if (framesCount > 0) {
        buf.p1(1);
        buf.p2(framesCount);
        for (let j = 0; j < framesCount; j++) buf.p2(delays[j]);
        for (let j = 0; j < framesCount; j++) buf.p2(frames[j] & 0xffff);
        for (let j = 0; j < framesCount; j++) buf.p2((frames[j] >>> 16) & 0xffff);
    }

    if (iframeMap.size > 0 || iframeCountField !== null) {
        const count = iframeCountField ?? (Math.max(...iframeMap.keys()) + 1);
        buf.p1(12);
        buf.p1(count);
        for (let j = 0; j < count; j++) buf.p2((iframeMap.get(j) ?? 65535) & 0xffff);
        for (let j = 0; j < count; j++) buf.p2(((iframeMap.get(j) ?? 65535) >>> 16) & 0xffff);
    }

    if (frameSounds.size > 0 || soundCountField !== null) {
        const count = soundCountField ?? (Math.max(...frameSounds.keys()) + 1);
        buf.p1(13);
        buf.p2(count);
        for (let j = 0; j < count; j++) {
            const snd = frameSounds.get(j);
            if (!snd) { buf.p1(0); continue; }
            const len = 1 + snd.alts.length;
            buf.p1(len);
            const packedVal = (snd.synth << 8) | ((snd.loops & 0x7) << 4) | (snd.volume & 0xf);
            buf.p3(packedVal);
            for (const alt of snd.alts) buf.p2(alt);
        }
    }

    buf.p1(0);
    return buf.data.subarray(0, buf.pos);
}

function readFlatFile(archive: number, group: number): Uint8Array {
    const filePath = path.join(CACHE_DIR, String(archive), `${group}.dat`);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Cache file not found: ${filePath}`);
    }
    return new Uint8Array(fs.readFileSync(filePath));
}

function assembleGroupBuffer(orderedFiles: Uint8Array[]): Uint8Array {
    const filesCount = orderedFiles.length;

    if (filesCount === 1) {
        return orderedFiles[0];
    }

    const totalDataSize = orderedFiles.reduce((s, f) => s + f.length, 0);
    const trailerSize = filesCount * 4 + 1;
    const groupBuffer = new Uint8Array(totalDataSize + trailerSize);
    const groupView = new DataView(groupBuffer.buffer, groupBuffer.byteOffset);

    let writePos = 0;
    for (const f of orderedFiles) {
        groupBuffer.set(f, writePos);
        writePos += f.length;
    }

    let trailerPos = totalDataSize;
    let prevSize = 0;
    for (let i = 0; i < filesCount; i++) {
        const delta = orderedFiles[i].length - prevSize;
        groupView.setInt32(trailerPos, delta, false);
        prevSize = orderedFiles[i].length;
        trailerPos += 4;
    }
    groupBuffer[trailerPos] = 1;

    return groupBuffer;
}

function pack() {
    const animNameToId = loadNameToIdMap('anim.pack');
    const seqNameToId = loadNameToIdMap('seq.pack');
    const configBlocks = readConfigFile('all.seq');
    const objNameToId = loadNameToIdMap('obj.pack');

    if (configBlocks.size === 0) {
        console.error(`No entries found in ${path.join(CONFIG_DIR, 'all.seq')}`);
        return;
    }

    const configIndex = new Js5Index(false, false);

    const indexData = readFlatFile(255, 20);
    configIndex.decode(indexData);

    const encodedGroups = new Map<number, Map<number, Uint8Array>>();

    for (const [name, lines] of configBlocks) {
        const id = seqNameToId.get(name);
        if (id === undefined) {
            console.warn(`No ID for entry [${name}] — skipping.`);
            continue;
        }

        const groupId = id & 0x7f;
        const fileId = id >>> 7;

        if (!encodedGroups.has(groupId)) {
            encodedGroups.set(groupId, new Map());
        }

        encodedGroups.get(groupId)!.set(fileId, encodeSeq(lines, animNameToId, objNameToId));
    }

    const modifiedContainers = new Map<number, Uint8Array>();

    for (const groupId of configIndex.groupIds) {
        const rawContainer = readFlatFile(20, groupId);
        configIndex.packed[groupId] = rawContainer;

        if (!configIndex.unpackGroup(groupId)) {
            console.error(`Failed to unpack Sequence group ${groupId}.`);
            continue;
        }

        const filesCount = configIndex.groupSize[groupId];
        const fileIds = configIndex.fileIds[groupId];

        const encodedMap = encodedGroups.get(groupId) ?? new Map<number, Uint8Array>();

        const orderedIds = Array.from({ length: filesCount }, (_, i) => fileIds ? fileIds[i] : i);
        const orderedFiles = orderedIds.map(id => {
            const enc = encodedMap.get(id);
            if (!enc) {
                return configIndex.unpacked[groupId]?.[id] ?? new Uint8Array([0x00]);
            }
            return enc;
        });

        const groupBuffer = assembleGroupBuffer(orderedFiles);
        const container = packGroupAuto(groupBuffer, rawContainer);

        const outDir = path.join(CACHE_OUT_DIR, '20');
        const outPath = path.join(outDir, `${groupId}.dat`);
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(outPath, container);

        modifiedContainers.set(groupId, container);
    }

    // const updatedMaster = updateMasterIndex(20, modifiedContainers);
    // writeMasterIndex(updatedMaster, 20);

    // const updatedChecksum = updateChecksumTable(new Map([[20, updatedMaster]]));
    // writeChecksumTable(updatedChecksum);
}

pack();
