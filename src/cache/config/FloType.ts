import { ConfigType } from '#/cache/config/ConfigType.js';
import Packet from '#/io/Packet.js';
import Js5Index from '#/js5/Js5Index.js';

export default class FloType extends ConfigType {
    static configNames: Map<string, number> = new Map();
    static configs: FloType[] = [];
    static numDefinitions: number = 0;
    static defaultWater: number = 0;

    static get(id: number): FloType {
        return FloType.configs[id];
    }

    static getId(name: string): number {
        return FloType.configNames.get(name) ?? -1;
    }

    static getByName(name: string): FloType | null {
        const id = this.getId(name);
        if (id === -1) {
            return null;
        }

        return this.get(id);
    }

    static load(index: Js5Index): void {
        if (!index.packed[4] || Object.keys(index.unpacked[4] ?? {}).length === 0) {
            if (!index.unpackGroup(4)) {
                throw new Error('Failed to unpack Floor Overlays group (2.4).');
            }
        }

        const count = index.groupSize[4];
        const fileIds = index.fileIds[4];

        FloType.configs = new Array(count);
        FloType.configNames.clear();

        for (let i = 0; i < count; i++) {
            const fileId = fileIds ? fileIds[i] : i;
            const data = index.unpacked[4][fileId];
            if (!data) {
                continue;
            }

            const type = new FloType(fileId);
            type.decodeType(new Packet(data));
            type.postDecode();

            FloType.configs[fileId] = type;
            if (type.debugname) {
                FloType.configNames.set(type.debugname.toLowerCase(), fileId);
            }
        }

        FloType.numDefinitions = count;
    }

    colour: number = 0;
    material: number = -1;
    occlude: boolean = true;
    mapcolour: number = -1;
    waterfogcolour: number = 1190717;
    waterfogscale: number = 16;

    decode(code: number, dat: Packet): void {
        if (code === 1) {
            this.colour = FloType.getHsl(dat.g3());
        } else if (code === 2) {
            this.material = dat.g1();
        } else if (code === 3) {
            this.material = dat.g2();
            if (this.material === 65535) {
                this.material = -1;
            }
        } else if (code === 5) {
            this.occlude = false;
        } else if (code === 6) {
            this.debugname = dat.gjstr();
        } else if (code === 7) {
            this.mapcolour = FloType.getHsl(dat.g3());
        } else if (code === 8) {
            FloType.defaultWater = this.id;
        } else if (code === 9) {
            // materialscale
            dat.g2();
        } else if (code === 10) {
            // hardshadow
        } else if (code === 11) {
            // priority
            dat.g1();
        } else if (code === 12) {
            // blend
        } else if (code === 13) {
            this.waterfogcolour = dat.g3();
        } else if (code === 14) {
            this.waterfogscale = dat.g1();
        }
    }

    static getHsl(arg0: number): number {
        return arg0 === 16711935 ? -1 : FloType.getColour(arg0);
    }

    static getColour(arg0: number): number {
        const var1 = ((arg0 >> 8) & 0xff) / 256.0;
        const var3 = ((arg0 >> 16) & 0xff) / 256.0;
        const var5 = (arg0 & 0xff) / 256.0;
        let var7 = var3;
        if (var3 < var1) {
            var7 = var1;
        }
        let var9 = 0.0;
        let var11 = var3;
        if (var1 < var3) {
            var11 = var1;
        }
        if (var7 < var5) {
            var7 = var5;
        }
        if (var11 > var5) {
            var11 = var5;
        }
        let var13 = 0.0;
        const var15 = (var11 + var7) / 2.0;
        if (var11 !== var7) {
            if (var15 < 0.5) {
                var9 = (var7 - var11) / (var7 + var11);
            }
            if (var3 === var7) {
                var13 = (var1 - var5) / (var7 - var11);
            } else if (var7 === var1) {
                var13 = (var5 - var3) / (var7 - var11) + 2.0;
            } else if (var5 === var7) {
                var13 = (var3 - var1) / (-var11 + var7) + 4.0;
            }
            if (var15 >= 0.5) {
                var9 = (var7 - var11) / (2.0 - var11 - var7);
            }
        }
        const var17 = var13 / 6.0;
        let var19 = Math.trunc(var9 * 256.0);
        const var20 = Math.trunc(var17 * 256.0);
        if (var19 < 0) {
            var19 = 0;
        } else if (var19 > 255) {
            var19 = 255;
        }
        let var21 = Math.trunc(var15 * 256.0);
        if (var21 < 0) {
            var21 = 0;
        } else if (var21 > 255) {
            var21 = 255;
        }
        if (var21 > 243) {
            var19 >>= 4;
        } else if (var21 > 217) {
            var19 >>= 3;
        } else if (var21 > 192) {
            var19 >>= 2;
        } else if (var21 > 179) {
            var19 >>= 1;
        }
        return ((var19 >> 5) << 7) + ((var20 >> 2) << 10) + (var21 >> 1);
    }
}
