import Js5Index from '#/js5/Js5Index.js';
import Packet from '#/io/Packet.js';
import {
    ensureOutputDirs,
    writePackFile,
    writeConfigFile,
    resolveName,
    readFlatFile,
    loadPackFile
} from '#tools/util/ConfigPackHelper.ts';

function unpack() {
    ensureOutputDirs();

    const nameMap = loadPackFile('inv-names.pack');

    try {
        const configIndex = new Js5Index(false, false);

        const indexData = readFlatFile(255, 2);
        if (!indexData) {
            console.error('Failed to read Configs Archive Index (255.2) from cache.');
            return;
        }
        configIndex.decode(indexData);

        const invGroupData = readFlatFile(2, 5);
        if (!invGroupData) {
            console.error('Failed to read Inventories Group (2.5) from cache.');
            return;
        }
        configIndex.packed[5] = invGroupData;

        if (!configIndex.unpackGroup(5)) {
            console.error('Failed to unpack Inventories group.');
            return;
        }

        const filesCount = configIndex.groupSize[5];
        const fileIds = configIndex.fileIds[5];

        const resolvedNames = new Map<number, string>();
        const packLines: string[] = [];
        const configBlocks: string[] = [];

        for (let i = 0; i < filesCount; i++) {
            const fileId = fileIds ? fileIds[i] : i;
            const fileData = configIndex.unpacked[5][fileId];

            let debugName: string | null = null;

            if (fileData && fileData.length > 0) {
                const buf = new Packet(fileData);
                try {
                    while (buf.pos < buf.data.length) {
                        const opcode = buf.g1();
                        if (opcode === 0) break;

                        if (opcode === 2) {
                            buf.pos += 2;
                        }
                    }
                } catch {}
            }

            const name = nameMap.get(fileId) ?? resolveName(debugName, 'inv', fileId);
            resolvedNames.set(fileId, name);
            packLines.push(`${fileId}=${name}`);
        }

        writePackFile('inv.pack', packLines);

        // Second pass: Parse config options and build the .inv file
        for (let i = 0; i < filesCount; i++) {
            const fileId = fileIds ? fileIds[i] : i;
            const fileData = configIndex.unpacked[5][fileId];

            const name = resolvedNames.get(fileId) ?? `inv_${fileId}`;
            const def: string[] = [`[${name}]`];

            if (fileData && fileData.length > 0) {
                const buf = new Packet(fileData);
                try {
                    while (buf.pos < buf.data.length) {
                        const opcode = buf.g1();
                        if (opcode === 0) break;

                        if (opcode === 2) {
                            const size = buf.g2();
                            def.push(`size=${size}`);
                        }
                    }
                } catch (err) {
                    console.error(`Parsing warning on ID ${fileId}:`, err);
                }
            }

            configBlocks.push(def.join('\n'));
        }

        writeConfigFile('all.inv', configBlocks);

    } catch (err) {
        console.error('An error occurred during inventory unpacking:', err);
    }
}

unpack();