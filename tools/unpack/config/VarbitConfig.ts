import Js5Index from '#/js5/Js5Index.js';
import Packet from '#/io/Packet.js';
import {
    ensureOutputDirs,
    writePackFile,
    writeConfigFile,
    loadPackFile,
    readFlatFile
} from '#tools/util/ConfigPackHelper.ts';

function unpack() {
    ensureOutputDirs();

    const varpMap = loadPackFile('varp.pack');

    try {
        const configIndex = new Js5Index(false, false);

        const indexData = readFlatFile(255, 22);
        if (!indexData) {
            console.error('Failed to read Varbit Archive Index (255.22) from cache.');
            return;
        }
        configIndex.decode(indexData);

        const resolvedNames = new Map<number, string>();
        const packLines: string[] = [];
        const configBlocks: string[] = [];

        // Sequential counter for clean naming — decoupled from the raw
        // varbit ID (which jumps by 1024 per file since fileId occupies
        // the high bits: id = (fileId << 10) | groupId).
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
                // Client: getGroupId(id) = id & 0x3FF, getFileId(id) = id >>> 10
                const varbitId = (fileId << 10) | groupId;

                const name = `varbit_${nextIndex}`;
                nextIndex++;

                resolvedNames.set(varbitId, name);
                packLines.push(`${varbitId}=${name}`);
            }
        }

        writePackFile('varbit.pack', packLines);

        for (const groupId of configIndex.groupIds) {
            if (!configIndex.unpacked[groupId]) continue;

            const filesCount = configIndex.groupSize[groupId];
            const fileIds = configIndex.fileIds[groupId];

            for (let i = 0; i < filesCount; i++) {
                const fileId = fileIds ? fileIds[i] : i;
                const fileData = configIndex.unpacked[groupId][fileId];
                if (!fileData) continue;

                const varbitId = (fileId << 10) | groupId;
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
        }

        writeConfigFile('all.varbit', configBlocks);

    } catch (err) {
        console.error('Error during Varbit unpacking:', err);
    }
}

unpack();