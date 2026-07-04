import Js5Index from '#/js5/Js5Index.js';
import Packet from '#/io/Packet.js';
import {
    ensureOutputDirs,
    writePackFile,
    writeConfigFile,
    resolveName,
    readFlatFile
} from '#tools/util/ConfigPackHelper.ts';

function unpack() {
    ensureOutputDirs();

    try {
        const configIndex = new Js5Index(false, false);

        const indexData = readFlatFile(255, 2);
        if (!indexData) {
            console.error('Failed to read Configs Archive Index (255.2) from cache.');
            return;
        }
        configIndex.decode(indexData);

        const varpGroupData = readFlatFile(2, 16);
        if (!varpGroupData) {
            console.error('Failed to read Varp Group (2.16) from cache.');
            return;
        }
        configIndex.packed[16] = varpGroupData;

        if (!configIndex.unpackGroup(16)) {
            console.error('Failed to unpack Varp group.');
            return;
        }

        const filesCount = configIndex.groupSize[16];
        const fileIds = configIndex.fileIds[16];

        const resolvedNames = new Map<number, string>();
        const packLines: string[] = [];
        const configBlocks: string[] = [];

        for (let i = 0; i < filesCount; i++) {
            const fileId = fileIds ? fileIds[i] : i;
            const name = resolveName(null, 'varp', fileId);
            resolvedNames.set(fileId, name);
            packLines.push(`${fileId}=${name}`);
        }

        writePackFile('varp.pack', packLines);

        for (let i = 0; i < filesCount; i++) {
            const fileId = fileIds ? fileIds[i] : i;
            const fileData = configIndex.unpacked[16][fileId];
            if (!fileData) continue;

            const name = resolvedNames.get(fileId) ?? `varp_${fileId}`;
            const buf = new Packet(fileData);
            const def: string[] = [`[${name}]`];

            try {
                while (buf.pos < buf.data.length) {
                    const opcode = buf.g1();
                    if (opcode === 0) break;

                    if (opcode === 5) {
                        def.push(`clientcode=${buf.g2()}`);
                    }
                }
            } catch (err) {
                console.error(`Parsing warning on ID ${fileId}:`, err);
            }

            configBlocks.push(def.join('\n'));
        }

        writeConfigFile('all.varp', configBlocks);

    } catch (err) {
        console.error('Error during Varp unpacking:', err);
    }
}

unpack();
