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

        const underlaysGroupData = readFlatFile(2, 1);
        if (!underlaysGroupData) {
            console.error('Failed to read Floor Underlays Group (2.1) from cache.');
            return;
        }
        configIndex.packed[1] = underlaysGroupData;

        if (!configIndex.unpackGroup(1)) {
            console.error('Failed to unpack Floor Underlays group.');
            return;
        }

        const filesCount = configIndex.groupSize[1];
        const fileIds  = configIndex.fileIds[1];

        const resolvedNames = new Map<number, string>();
        const packLines: string[] = [];
        const configBlocks: string[] = [];

        for (let i = 0; i < filesCount; i++) {
            const fileId = fileIds ? fileIds[i] : i;
            const fileData = configIndex.unpacked[1][fileId];
            if (!fileData) continue;

            const buf = new Packet(fileData);
            let debugName: string | null = null;

            try {
                while (buf.pos < buf.data.length) {
                    const opcode = buf.g1();
                    if (opcode === 0) break;

                    if      (opcode === 1) { buf.pos += 3; }
                    else if (opcode === 2) { buf.pos += 2; }
                    else if (opcode === 3) { buf.pos += 2; }
                    else if (opcode === 4) {}
                    else if (opcode === 5) {}
                    else if (opcode === 6) { debugName = buf.gjstr(); }
                }
            } catch { }

            const name = resolveName(debugName, 'flu', fileId);
            resolvedNames.set(fileId, name);
            packLines.push(`${fileId}=${name}`);
        }

        const packPath = writePackFile('flu.pack', packLines);

        for (let i = 0; i < filesCount; i++) {
            const fileId = fileIds ? fileIds[i] : i;
            const fileData = configIndex.unpacked[1][fileId];
            if (!fileData) continue;

            const name = resolvedNames.get(fileId) ?? `flu_${fileId}`;
            const buf  = new Packet(fileData);
            const def: string[] = [`[${name}]`];

            try {
                while (buf.pos < buf.data.length) {
                    const opcode = buf.g1();
                    if (opcode === 0) break;

                    if (opcode === 1) {
                        def.push(`colour=${formatColour(buf.g3())}`);
                    } else if (opcode === 2) {
                        const id = buf.g2();
                        def.push(`texture=${textureMap.get(id) ?? `texture_${id}`}`);
                    } else if (opcode === 3) {
                        def.push(`scale=${buf.g2()}`);
                    } else if (opcode === 4) {
                        def.push('blend=no');
                    } else if (opcode === 5) {
                        def.push('occlude=no');
                    } else if (opcode === 6) {
                        buf.gjstr();
                    }
                }
            } catch (err) {
                console.error(`Parsing warning on ID ${fileId}:`, err);
            }

            configBlocks.push(def.join('\n'));
        }

        writeConfigFile('all.flu', configBlocks);

    } catch {
        
    }
}

unpack();