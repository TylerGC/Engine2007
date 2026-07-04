import { ConfigType } from '#/cache/config/ConfigType.js';
import ScriptVarType from '#/cache/config/ScriptVarType.js';
import Packet from '#/io/Packet.js';
import Js5Index from '#/js5/Js5Index.js';
import { printError } from '#/util/Logger.js';

export default class VarPlayerType extends ConfigType {
    static configNames: Map<string, number> = new Map();
    static configs: VarPlayerType[] = [];
    static count: number = 0;

    static SCOPE_TEMP = 0;
    static SCOPE_PERM = 1;

    static RUN = -1;

    static get(id: number): VarPlayerType {
        return VarPlayerType.configs[id];
    }

    static getId(name: string): number {
        return VarPlayerType.configNames.get(name.toLowerCase()) ?? -1;
    }

    static getByName(name: string): VarPlayerType | null {
        const id = this.getId(name);
        if (id === -1) {
            return null;
        }
        return this.get(id);
    }

    static load(index: Js5Index): void {
        const g = 16; // VARP_GROUP — archive 2, group 16
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

        VarPlayerType.configs = new Array(maxId + 1);
        VarPlayerType.configNames.clear();
        VarPlayerType.RUN = -1;

        let loadedCount = 0;

        for (let i = 0; i < groupSize; i++) {
            const fileId = fileIds ? fileIds[i] : i;
            const data = index.unpacked[g]?.[fileId];
            if (!data) {
                continue;
            }

            const type = new VarPlayerType(fileId);
            type.decodeType(new Packet(data));
            type.postDecode();

            VarPlayerType.configs[fileId] = type;
            loadedCount++;

            if (type.debugname) {
                VarPlayerType.configNames.set(type.debugname.toLowerCase(), fileId);
            }

            if (type.clientcode === 7) {
                // unused in client so my best guess is that this was used to find the engine varp
                VarPlayerType.RUN = type.id;
            }
        }

        VarPlayerType.count = loadedCount;
    }

    // --- Client-visible ---
    clientcode: number = 0;

    // --- Server-Only Properties ---
    scope: number = VarPlayerType.SCOPE_TEMP;
    type: number = ScriptVarType.INT;
    protect: boolean = true;
    transmit: boolean = false;

    decode(code: number, dat: Packet): void {
        if (code === 1) {
            this.scope = dat.g1();
        } else if (code === 2) {
            this.type = dat.g1();
        } else if (code === 4) {
            this.protect = false;
        } else if (code === 5) {
            this.clientcode = dat.g2();
        } else if (code === 6) {
            this.transmit = true;
        } else if (code === 250) {
            this.debugname = dat.gjstr();
        } else {
            printError(`Unrecognized varp config code: ${code}`);
        }
    }
}
