import Js5Index from '#/js5/Js5Index.js';
import Packet from '#/io/Packet.js';
import path from 'path';
import fs from 'fs';
import {
    ensureOutputDirs,
    writePackFile,
    writeConfigFile,
    loadPackFile,
    readFlatFile,
    PACK_DIR
} from '#tools/util/ConfigPackHelper.ts';

function unpack() {
    ensureOutputDirs();

    const varpMap = loadPackFile('varp.pack');
    const sequentialNames = loadPackFile('varbit-names.pack');

    try {
        const configIndex = new Js5Index(false, false);

        const indexData = readFlatFile(255, 22);
        if (!indexData) {
            console.error('Failed to read Varbit Archive Index (255.22) from cache.');
            return;
        }
        configIndex.decode(indexData);

        type Entry = { groupId: number; fileId: number; varbitId: number };
        const entries: Entry[] = [];
        const resolvedNames = new Map<number, string>();
        const packLines: string[] = [];

        let nextIndex = 0;

        for (const groupId of configIndex.groupIds) {
            const groupData = readFlatFile(22, groupId);
            if (!groupData) continue;

            configIndex.packed[groupId] = groupData;
            if (!configIndex.unpackGroup(groupId)) {
                console.error(`Failed to unpack Varbit group ${groupId}`);
                continue;
            }

            const filesCount = configIndex.groupSize[groupId];
            const fileIds = configIndex.fileIds[groupId];

            for (let i = 0; i < filesCount; i++) {
                const fileId = fileIds ? fileIds[i] : i;
                const varbitId = nextIndex;

                const name = sequentialNames.get(varbitId) ?? `varbit_${varbitId}`;
                nextIndex++;

                entries.push({ groupId, fileId, varbitId: varbitId });
                resolvedNames.set(varbitId, name);
                packLines.push(`${varbitId}=${name}`);
            }
        }

        writePackFile('varbit.pack', packLines);

        const locationLines = entries.map(e => `${e.varbitId}=${e.groupId}:${e.fileId}`);
        fs.writeFileSync(path.join(PACK_DIR, 'varbit-locations.pack'), locationLines.join('\n') + '\n');

        const configBlocks: string[] = [];

            for (const { groupId, fileId, varbitId: varbitId } of entries) {
                if (!configIndex.unpacked[groupId]) continue;

                const fileData = configIndex.unpacked[groupId][fileId];
                if (!fileData) continue;

                const name = resolvedNames.get(varbitId) ?? `varbit_${varbitId}`;
                const buf = new Packet(fileData);
                const def: string[] = [`[${name}]`];

                try {
                    while (buf.pos < buf.data.length) {
                        const opcode = buf.g1();
                        if (opcode === 0) break;

                        if (opcode === 1) {
                            const basevar = buf.g2();
                            const startbit = buf.g1();
                            const endbit = buf.g1();

                            const basevarName = varpMap.get(basevar) ?? `varp_${basevar}`;
                            def.push(`basevar=${basevarName}`);
                            def.push(`startbit=${startbit}`);
                            def.push(`endbit=${endbit}`);
                        }
                    }
                } catch (err) {
                    console.error(`Parsing warning on Varbit ID ${varbitId}:`, err);
                }

                configBlocks.push(def.join('\n'));
        }

        writeConfigFile('all.varbit', configBlocks);

    } catch (err) {
        console.error('Error during Varbit unpacking:', err);
    }
}

unpack();