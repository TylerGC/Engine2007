import { ConfigType } from '#/cache/config/ConfigType.js';
import Packet from '#/io/Packet.js';
import Js5Index from '#/js5/Js5Index.js';

export default class VarBitType extends ConfigType {
    static configNames: Map<string, number> = new Map();
    static configs: VarBitType[] = [];
    static count: number = 0;

    static get(id: number): VarBitType {
        return VarBitType.configs[id];
    }

    static getId(name: string): number {
        return VarBitType.configNames.get(name.toLowerCase()) ?? -1;
    }

    static getByName(name: string): VarBitType | null {
        const id = this.getId(name);
        if (id === -1) {
            return null;
        }
        return this.get(id);
    }

    static getGroupId(id: number): number {
        return id & 0x3ff;
    }

    static getFileId(id: number): number {
        return id >>> 10;
    }

    static load(index: Js5Index): void {
        const groupCount = index.capacity;

        let maxId = -1;
        for (let g = 0; g < groupCount; g++) {
            const groupSize = index.groupSize[g];
            if (groupSize === 0) continue;

            const fileIds = index.fileIds[g];
            for (let i = 0; i < groupSize; i++) {
                const fileId = fileIds ? fileIds[i] : i;
                const id = (fileId << 10) | g;
                if (id > maxId) maxId = id;
            }
        }

        if (maxId === -1) {
            VarBitType.count = 0;
            return;
        }

        VarBitType.configs = new Array(maxId + 1);
        VarBitType.configNames.clear();

        let loadedCount = 0;

        for (let g = 0; g < groupCount; g++) {
            const groupSize = index.groupSize[g];
            if (groupSize === 0) continue;

            if (!index.packed[g] || Object.keys(index.unpacked[g] ?? {}).length === 0) {
                if (!index.unpackGroup(g)) {
                    continue;
                }
            }

            const fileIds = index.fileIds[g];

            for (let i = 0; i < groupSize; i++) {
                const fileId = fileIds ? fileIds[i] : i;
                const data = index.unpacked[g]?.[fileId];
                if (!data) continue;

                const id = (fileId << 10) | g;

                const type = new VarBitType(id);
                type.decodeType(new Packet(data));
                type.postDecode();

                VarBitType.configs[id] = type;
                loadedCount++;

                if (type.debugname) {
                    VarBitType.configNames.set(type.debugname.toLowerCase(), id);
                }
            }
        }

        VarBitType.count = loadedCount;
    }

    basevar: number = 0;
    startbit: number = 0;
    endbit: number = 0;

    decode(code: number, dat: Packet): void {
        if (code === 1) {
            this.basevar = dat.g2();
            this.startbit = dat.g1();
            this.endbit = dat.g1();
        } else {
            throw new Error(`Unrecognized varbit config code: ${code}`);
        }
    }
}