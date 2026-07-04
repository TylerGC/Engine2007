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

function encodeVarbit(
    lines: string[],
    varpNameToId: Map<string, number>,
): Uint8Array {
    const buf = new Packet(new Uint8Array(256));

    let basevar = 0;
    let startbit = 0;
    let endbit = 0;
    let hasBasevar = false;

    for (const line of lines) {
        const eqIdx = line.indexOf('=');
        if (eqIdx === -1) continue;
        const key = line.slice(0, eqIdx).trim();
        const val = line.slice(eqIdx + 1).trim();

        switch (key) {
            case 'basevar':
                basevar = varpNameToId.get(val) ?? parseInt(val, 10);
                hasBasevar = true;
                break;
            case 'startbit':
                startbit = parseInt(val, 10);
                break;
            case 'endbit':
                endbit = parseInt(val, 10);
                break;
        }
    }

    if (hasBasevar) {
        buf.p1(1);
        buf.p2(basevar);
        buf.p1(startbit);
        buf.p1(endbit);
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
    const varpNameToId = loadNameToIdMap('varp.pack');
    const varbitNameToId = loadNameToIdMap('varbit.pack');
    const configBlocks = readConfigFile('all.varbit');

    if (configBlocks.size === 0) {
        console.error(`No entries found in ${path.join(CONFIG_DIR, 'all.varbit')}`);
        return;
    }

    const configIndex = new Js5Index(false, false);

    const indexData = readFlatFile(255, 22);
    configIndex.decode(indexData);

    const encodedGroups = new Map<number, Map<number, Uint8Array>>();

    for (const [name, lines] of configBlocks) {
        const id = varbitNameToId.get(name);
        if (id === undefined) {
            console.warn(`No ID for entry [${name}] — skipping.`);
            continue;
        }

        const groupId = id & 0x3ff;
        const fileId = id >>> 10;

        if (!encodedGroups.has(groupId)) {
            encodedGroups.set(groupId, new Map());
        }

        encodedGroups.get(groupId)!.set(fileId, encodeVarbit(lines, varpNameToId));
    }

    const modifiedContainers = new Map<number, Uint8Array>();

    for (const groupId of configIndex.groupIds) {
        const rawContainer = readFlatFile(22, groupId);
        configIndex.packed[groupId] = rawContainer;

        if (!configIndex.unpackGroup(groupId)) {
            console.error(`Failed to unpack Varbit group ${groupId}.`);
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

        const outDir = path.join(CACHE_OUT_DIR, '22');
        const outPath = path.join(outDir, `${groupId}.dat`);
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(outPath, container);

        modifiedContainers.set(groupId, container);
    }

    // const updatedMaster = updateMasterIndex(22, modifiedContainers);
    // writeMasterIndex(updatedMaster, 22);

    // const updatedChecksum = updateChecksumTable(new Map([[22, updatedMaster]]));
    // writeChecksumTable(updatedChecksum);
}

pack();