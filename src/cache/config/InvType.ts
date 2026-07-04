import { ConfigType } from '#/cache/config/ConfigType.js';
import Packet from '#/io/Packet.js';
import Js5Index from '#/js5/Js5Index.js';

export default class InvType extends ConfigType {
    static configNames: Map<string, number> = new Map();
    static configs: InvType[] = [];
    static count: number = 0;

    static SCOPE_TEMP = 0;
    static SCOPE_PERM = 1;
    static SCOPE_SHARED = 2;

    // commonly referenced in-engine
    static INV = -1;
    static WORN = -1;

    static get(id: number): InvType {
        return InvType.configs[id];
    }

    static getId(name: string): number {
        return InvType.configNames.get(name.toLowerCase()) ?? -1;
    }

    static getByName(name: string): InvType | null {
        const id = this.getId(name);
        if (id === -1) {
            return null;
        }
        return this.get(id);
    }

    static load(index: Js5Index): void {
        const g = 5; // INV_GROUP
        const groupCount = index.capacity;

        if (g >= groupCount) {
            return;
        }

        const groupSize = index.groupSize[g];
        if (groupSize === 0) return;

        if (!index.packed[g] || Object.keys(index.unpacked[g] ?? {}).length === 0) {
            if (!index.unpackGroup(g)) {
                return;
            }
        }

        const fileIds = index.fileIds[g];
        const maxId = fileIds && fileIds.length > 0 ? Math.max(...fileIds) : groupSize - 1;

        InvType.configs = new Array(maxId + 1);
        InvType.configNames.clear();

        let loadedCount = 0;

        for (let i = 0; i < groupSize; i++) {
            const fileId = fileIds ? fileIds[i] : i;
            const data = index.unpacked[g]?.[fileId];
            if (!data) {
                continue;
            }

            const type = new InvType(fileId);
            type.decodeType(new Packet(data));
            type.postDecode();

            InvType.configs[fileId] = type;
            loadedCount++;

            if (type.debugname) {
                InvType.configNames.set(type.debugname.toLowerCase(), fileId);
            }
        }

        InvType.count = loadedCount;

        // Resolve common cache-defined engine indices here:
        InvType.INV = InvType.getId('inv');
        InvType.WORN = InvType.getId('worn');
    }

    size: number = 1;

    // --- Server-Only Properties ---
    scope: number = 0;
    stackall: boolean = false;
    stockobj: number[] | null = null;
    stockcount: number[] | null = null;
    stockrate: number[] | null = null;
    restock: boolean = false;
    allstock: boolean = false;
    protect: boolean = true;
    runweight: boolean = false;
    dummyinv: boolean = false;
    debugname: string | null = null;

    decode(code: number, dat: Packet): void {
        if (code === 1) {
            this.scope = dat.g1();
        } else if (code === 2) {
            this.size = dat.g2();
        } else if (code === 3) {
            this.stackall = true;
        } else if (code === 4) {
            const count = dat.g1();
            this.stockobj = new Array(count);
            this.stockcount = new Array(count);
            this.stockrate = new Array(count);
            for (let j = 0; j < count; j++) {
                this.stockobj[j] = dat.g2();
                this.stockcount[j] = dat.g2();
                this.stockrate[j] = dat.g4();
            }
        } else if (code === 5) {
            this.restock = true;
        } else if (code === 6) {
            this.allstock = true;
        } else if (code === 7) {
            this.protect = false;
        } else if (code === 8) {
            this.runweight = true;
        } else if (code === 9) {
            this.dummyinv = true;
        } else if (code === 250) {
            this.debugname = dat.gjstr();
        } else {
            throw new Error(`Unrecognized inv config code: ${code}`);
        }
    }
}
