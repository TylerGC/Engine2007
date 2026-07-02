import { ConfigType } from '#/cache/config/ConfigType.js';
import Packet from '#/io/Packet.js';
import Js5Index from '#/js5/Js5Index.js';

export default class FluType extends ConfigType {
    static configNames: Map<string, number> = new Map();
    static configs: FluType[] = [];
    static numDefinitions: number = 0;

    static get(id: number): FluType {
        return FluType.configs[id];
    }

    static getId(name: string): number {
        return FluType.configNames.get(name) ?? -1;
    }

    static getByName(name: string): FluType | null {
        const id = this.getId(name);
        if (id === -1) {
            return null;
        }

        return this.get(id);
    }

    static load(index: Js5Index): void {
        if (!index.packed[1] || Object.keys(index.unpacked[1] ?? {}).length === 0) {
            if (!index.unpackGroup(1)) {
                throw new Error('Failed to unpack Floor Underlays group (2.1).');
            }
        }

        const count = index.groupSize[1];
        const fileIds = index.fileIds[1];

        FluType.configs = new Array(count);
        FluType.configNames.clear();

        for (let i = 0; i < count; i++) {
            const fileId = fileIds ? fileIds[i] : i;
            const data = index.unpacked[1][fileId];
            if (!data) {
                continue;
            }

            const type = new FluType(fileId);
            type.decodeType(new Packet(data));
            type.postDecode();

            FluType.configs[fileId] = type;
            if (type.debugname) {
                FluType.configNames.set(type.debugname.toLowerCase(), fileId);
            }
        }

        FluType.numDefinitions = count;
    }

    colour: number = 0;
    texture: number = -1;
    chroma: number = 0;
    saturation: number = 0;
    lightness: number = 0;
    hue: number = 0;
    materialScale: number = 0;
    blend: boolean = true;
    occlude: boolean = true;

    decode(code: number, dat: Packet): void {
        if (code === 1) {
            this.colour = dat.g3();
            this.getHsl(this.colour);
        } else if (code === 2) {
            this.texture = dat.g2();
            if (this.texture === 65535) {
                this.texture = -1;
            }
        } else if (code === 3) {
            // materialscale
            this.materialScale = dat.g2();
        } else if (code === 4) {
            this.blend = false;
        } else if (code === 5) {
            this.occlude = false;
        }
    }

    getHsl(arg0: number): void {
        const var2 = ((arg0 >> 16) & 0xff) / 256.0;
        const var4 = ((arg0 >> 8) & 0xff) / 256.0;
        const var6 = (arg0 & 0xff) / 256.0;

        let var8 = var2;
        if (var2 > var4) {
            var8 = var4;
        }

        let var10 = var2;
        if (var2 < var4) {
            var10 = var4;
        }
        if (var6 > var10) {
            var10 = var6;
        }
        if (var6 < var8) {
            var8 = var6;
        }

        let var12 = 0.0;
        let var14 = 0.0;
        const var16 = (var10 + var8) / 2.0;

        this.lightness = Math.trunc(var16 * 256.0);
        if (this.lightness < 0) {
            this.lightness = 0;
        } else if (this.lightness > 255) {
            this.lightness = 255;
        }

        if (var8 !== var10) {
            if (var16 < 0.5) {
                var12 = (var10 - var8) / (var8 + var10);
            }
            if (var2 === var10) {
                var14 = (var4 - var6) / (var10 - var8);
            } else if (var4 === var10) {
                var14 = (var6 - var2) / (var10 - var8) + 2.0;
            } else if (var6 === var10) {
                var14 = (var2 - var4) / (-var8 + var10) + 4.0;
            }
            if (var16 >= 0.5) {
                var12 = (var10 - var8) / (2.0 - var10 - var8);
            }
        }

        this.saturation = Math.trunc(var12 * 256.0);
        const var18 = var14 / 6.0;
        if (this.saturation < 0) {
            this.saturation = 0;
        } else if (this.saturation > 255) {
            this.saturation = 255;
        }

        if (var16 > 0.5) {
            this.chroma = Math.trunc(var12 * (1.0 - var16) * 512.0);
        } else {
            this.chroma = Math.trunc(var12 * var16 * 512.0);
        }
        if (this.chroma < 1) {
            this.chroma = 1;
        }

        this.hue = Math.trunc(var18 * this.chroma);
    }
}
