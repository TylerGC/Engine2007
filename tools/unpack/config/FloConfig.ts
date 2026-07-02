import Js5Index from '#/js5/Js5Index.js';
import Packet from '#/io/Packet.js';
import {
    ensureOutputDirs,
    writePackFile,
    writeConfigFile,
    resolveName,
    formatColour,
    loadPackFile,
    readFlatFile
} from '#tools/util/ConfigPackHelper.ts';

function unpack() {
    ensureOutputDirs();

    const textureMap = loadPackFile('texture.pack');

    try {
        const configIndex = new Js5Index(false, false);

        const indexData = readFlatFile(255, 2);
        if (!indexData) {
            console.error('Failed to read Configs Archive Index (255.2) from cache.');
            return;
        }
        configIndex.decode(indexData);

        const overlaysGroupData = readFlatFile(2, 4);

        if (!overlaysGroupData) {
            console.error('Failed to read Floor Overlays Group (2.4) from cache.');
            return;
        }
        configIndex.packed[4] = overlaysGroupData;

        if (!configIndex.unpackGroup(4)) {
            console.error('Failed to unpack Floor Overlays group.');
            return;
        }

        const filesCount = configIndex.groupSize[4];
        const fileIds  = configIndex.fileIds[4];

        const resolvedNames = new Map<number, string>();
        const packLines: string[] = [];
        const configBlocks: string[] = [];

        for (let i = 0; i < filesCount; i++) {
            const fileId = fileIds ? fileIds[i] : i;
            const fileData = configIndex.unpacked[4][fileId];
            if (!fileData) continue;

            const buf = new Packet(fileData);
            let debugName: string | null = null;

            try {
                while (buf.pos < buf.data.length) {
                    const opcode = buf.g1();
                    if (opcode === 0) break;

                    if      (opcode === 1)  { buf.pos += 3; }
                    else if (opcode === 2)  { buf.pos += 1; }
                    else if (opcode === 3)  { buf.pos += 2; }
                    else if (opcode === 5)  {}
                    else if (opcode === 6)  { debugName = buf.gjstr(); }
                    else if (opcode === 7)  { buf.pos += 3; }
                    else if (opcode === 8)  {}
                    else if (opcode === 9)  { buf.pos += 2; }
                    else if (opcode === 10) {}
                    else if (opcode === 11) { buf.pos += 1; }
                    else if (opcode === 12) {}
                    else if (opcode === 13) { buf.pos += 3; }
                    else if (opcode === 14) { buf.pos += 1; }
                }
            } catch {}

            const name = resolveName(debugName, 'flo', fileId);
            resolvedNames.set(fileId, name);
            packLines.push(`${fileId}=${name}`);
        }

        writePackFile('flo.pack', packLines);

        for (let i = 0; i < filesCount; i++) {
            const fileId = fileIds ? fileIds[i] : i;
            const fileData = configIndex.unpacked[4][fileId];
            if (!fileData) continue;

            const name = resolvedNames.get(fileId) ?? `flo_${fileId}`;
            const buf  = new Packet(fileData);
            const def: string[] = [`[${name}]`];

            try {
                while (buf.pos < buf.data.length) {
                    const opcode = buf.g1();
                    if (opcode === 0) break;

                    if (opcode === 1) {
                        def.push(`colour=${formatColour(buf.g3())}`);
                    } else if (opcode === 2) {
                        const id = buf.g1();
                        def.push(`texture=${textureMap.get(id) ?? `texture_${id}`}`);
                    } else if (opcode === 3) {
                        const id = buf.g2();
                        def.push(`texture=${textureMap.get(id) ?? `texture_${id}`}`);
                        def.push(`texture_size=2`);
                    } else if (opcode === 5) {
                        def.push('occlude=no');
                    } else if (opcode === 6) {
                        buf.gjstr();
                    } else if (opcode === 7) {
                        def.push(`mapcolour=${formatColour(buf.g3())}`);
                    } else if (opcode === 8) {
                        def.push('water=yes');
                    } else if (opcode === 9) {
                        def.push(`scale=${buf.g2()}`);
                    } else if (opcode === 10) {
                        def.push('shadow=no');
                    } else if (opcode === 11) {
                        def.push(`priority=${buf.g1()}`);
                    } else if (opcode === 12) {
                        def.push('blend=yes');
                    } else if (opcode === 13) {
                        def.push(`waterfogcolour=${formatColour(buf.g3())}`);
                    } else if (opcode === 14) {
                        def.push(`waterfogscale=${buf.g1()}`);
                    }
                }
            } catch (err) {
                console.error(`Parsing warning on ID ${fileId}:`, err);
            }

            configBlocks.push(def.join('\n'));
        }

       writeConfigFile('all.flo', configBlocks);

    } catch {
    }
}

unpack();
