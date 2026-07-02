import { ConfigType } from '#/cache/config/ConfigType.js';
import Packet from '#/io/Packet.js';
import Js5Index from '#/js5/Js5Index.js';

export default class ObjType extends ConfigType {
    static configNames: Map<string, number> = new Map();
    static configs: ObjType[] = [];
    static numDefinitions: number = 0;

    static get(id: number): ObjType {
        return ObjType.configs[id];
    }

    static getId(name: string): number {
        return ObjType.configNames.get(name.toLowerCase()) ?? -1;
    }

    static getByName(name: string): ObjType | null {
        const id = this.getId(name);
        if (id === -1) {
            return null;
        }
        return this.get(id);
    }

    static getWearPosId(name: string): number {
        switch (name) {
            case 'hat':
                return 0;
            case 'back':
                return 1;
            case 'front':
                return 2;
            case 'righthand':
                return 3;
            case 'torso':
                return 4;
            case 'lefthand':
                return 5;
            case 'arms':
                return 6;
            case 'legs':
                return 7;
            case 'head':
                return 8;
            case 'hands':
                return 9;
            case 'feet':
                return 10;
            case 'jaw':
                return 11;
            case 'ring':
                return 12;
            case 'quiver':
                return 13;
            default:
                return -1;
        }
    }

    static load(index: Js5Index): void {
        const groupCount = index.capacity;

        const maxId = ((groupCount - 1) << 8) | 255;
        ObjType.configs = new Array(maxId + 1);
        ObjType.configNames.clear();

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
                if (!data) {
                    continue;
                }

                const itemId = (g << 8) | fileId;
                const type = new ObjType(itemId);
                type.decodeType(new Packet(data));
                type.postDecode();

                ObjType.configs[itemId] = type;
                loadedCount++;

                if (type.debugname) {
                    ObjType.configNames.set(type.debugname.toLowerCase(), itemId);
                } else if (type.name) {
                    ObjType.configNames.set(type.name.toLowerCase(), itemId);
                }
            }
        }

        for (let i = 0; i < ObjType.configs.length; i++) {
            const type = ObjType.configs[i];
            if (!type) continue;

            if (type.certtemplate !== -1) {
                type.genCert(ObjType.get(type.certlink), ObjType.get(type.certtemplate));
            }
            if (type.lenttemplate !== -1) {
                type.genLent(ObjType.get(type.lentlink), ObjType.get(type.lenttemplate));
            }
            if (type.dummyitem !== 0) {
                type.tradeable = false;
            }
        }

        ObjType.numDefinitions = loadedCount;
    }

    name: string | null = null;
    members: boolean = false;
    cost: number = 1;
    stackable: number = 0;
    dummyitem: number = 0;
    team: number = 0;
    stockmarket: boolean = false;
    zoom2d: number = 2000;
    xan2d: number = 0;
    yan2d: number = 0;
    zan2d: number = 0;
    xof2d: number = 0;
    yof2d: number = 0;
    model: number = 0;
    manwear: number = -1;
    manwear2: number = -1;
    manwear3: number = -1;
    manwearOffsetY: number = 0;
    womanwear: number = -1;
    womanwear2: number = -1;
    womanwear3: number = -1;
    womanwearOffsetY: number = 0;
    manhead: number = -1;
    manhead2: number = -1;
    womanhead: number = -1;
    womanhead2: number = -1;
    resizex: number = 128;
    resizey: number = 128;
    resizez: number = 128;
    ambient: number = 0;
    contrast: number = 0;
    recol_s: number[] | null = null;
    recol_d: number[] | null = null;
    recol_d_palette: number[] | null = null;
    retex_s: number[] | null = null;
    retex_d: number[] | null = null;
    op: (string | null)[] = [null, null, 'Take', null, null];
    iop: (string | null)[] = [null, null, null, null, 'Drop'];
    params: Map<number, number | string> | null = null;
    certlink: number = -1;
    certtemplate: number = -1;
    lentlink: number = -1;
    lenttemplate: number = -1;
    countobj: number[] | null = null;
    countco: number[] | null = null;
    offsets: number[][] | null = null;

    // --- Server-Only Properties ---
    desc: string | null = null;
    tradeable: boolean = true;
    code10: number = -1;
    wearpos: number = -1;
    wearpos2: number = -1;
    wearpos3: number = -1;
    weaponanimset: number = -1;
    weight: number = 0;
    category: number = -1;
    questreq: number = -1;
    customcode: number = -1;

decode(code: number, dat: Packet): void {
        if (code === 1) {
            this.model = dat.g2();
        } else if (code === 2) {
            this.name = dat.gjstr();
        } else if (code === 3) {
            this.desc = dat.gjstr();
        } else if (code === 4) {
            this.zoom2d = dat.g2();
        } else if (code === 5) {
            this.xan2d = dat.g2();
        } else if (code === 6) {
            this.yan2d = dat.g2();
        } else if (code === 7) {
            this.xof2d = dat.g2s();
        } else if (code === 8) {
            this.yof2d = dat.g2s();
        } else if (code === 9) {
            this.tradeable = false;
        } else if (code === 10) {
            this.code10 = dat.g2();
        } else if (code === 11) {
            this.stackable = 1;
        } else if (code === 12) {
            this.cost = dat.g4();
        } else if (code === 13) {
            this.wearpos = dat.g1();
        } else if (code === 14) {
            this.wearpos2 = dat.g1();
        } else if (code === 15) {
            this.wearpos3 = dat.g1();
        } else if (code === 16) {
            this.members = true;
        } else if (code === 23) {
            this.manwear = dat.g2();
            this.manwearOffsetY = dat.g1b();
        } else if (code === 24) {
            this.manwear2 = dat.g2();
        } else if (code === 25) {
            this.womanwear = dat.g2();
            this.womanwearOffsetY = dat.g1b();
        } else if (code === 26) {
            this.womanwear2 = dat.g2();
        } else if (code === 27) {
            this.weaponanimset = dat.g1();
        } else if (code >= 30 && code < 35) {
            this.op[code - 30] = dat.gjstr();
            if (this.op[code - 30]?.toLowerCase() === 'hidden') {
                this.op[code - 30] = null;
            }
        } else if (code >= 35 && code < 40) {
            this.iop[code - 35] = dat.gjstr();
        } else if (code === 40) {
            const count = dat.g1();
            this.recol_s = new Array(count);
            this.recol_d = new Array(count);
            for (let j = 0; j < count; j++) {
                this.recol_s[j] = dat.g2();
                this.recol_d[j] = dat.g2();
            }
        } else if (code === 41) {
            const count = dat.g1();
            this.retex_s = new Array(count);
            this.retex_d = new Array(count);
            for (let j = 0; j < count; j++) {
                this.retex_s[j] = dat.g2();
                this.retex_d[j] = dat.g2();
            }
        } else if (code === 42) {
            const count = dat.g1();
            this.recol_d_palette = new Array(count);
            for (let j = 0; j < count; j++) {
                this.recol_d_palette[j] = dat.g1b();
            }
        } else if (code === 65) {
            this.stockmarket = true;
        } else if (code === 75) {
            this.weight = dat.g2s();
        } else if (code === 78) {
            this.manwear3 = dat.g2();
        } else if (code === 79) {
            this.womanwear3 = dat.g2();
        } else if (code === 90) {
            this.manhead = dat.g2();
        } else if (code === 91) {
            this.womanhead = dat.g2();
        } else if (code === 92) {
            this.manhead2 = dat.g2();
        } else if (code === 93) {
            this.womanhead2 = dat.g2();
        } else if (code === 94) {
            this.category = dat.g2();
        } else if (code === 95) {
            this.zan2d = dat.g2();
        } else if (code === 96) {
            this.dummyitem = dat.g1();
        } else if (code === 97) {
            this.certlink = dat.g2();
        } else if (code === 98) {
            this.certtemplate = dat.g2();
        } else if (code >= 100 && code < 110) {
            if (!this.countobj || !this.countco) {
                this.countobj = new Array(10).fill(-1);
                this.countco = new Array(10).fill(0);
            }
            this.countobj[code - 100] = dat.g2();
            this.countco[code - 100] = dat.g2();
        } else if (code === 110) {
            this.resizex = dat.g2();
        } else if (code === 111) {
            this.resizey = dat.g2();
        } else if (code === 112) {
            this.resizez = dat.g2();
        } else if (code === 113) {
            this.ambient = dat.g1b();
        } else if (code === 114) {
            this.contrast = dat.g1b() * 5;
        } else if (code === 115) {
            this.team = dat.g1();
        } else if (code === 121) {
            this.lentlink = dat.g2();
        } else if (code === 122) {
            this.lenttemplate = dat.g2();
        } else if (code === 123) {
            this.questreq = dat.g2();
        } else if (code === 124) {
            if (!this.offsets) {
                this.offsets = [];
            }
            const index = dat.g1();
            this.offsets[index] = new Array(6);
            for (let j = 0; j < 6; j++) {
                this.offsets[index][j] = dat.g2s();
            }
        } else if (code === 201) {
            this.customcode = dat.g2();
        } else if (code === 249) {
            const count = dat.g1();
            if (!this.params) {
                this.params = new Map();
            }
            for (let j = 0; j < count; j++) {
                const isString = dat.g1() === 1;
                const key = dat.g3();
                const val = isString ? dat.gjstr() : dat.g4();
                this.params.set(key, val);
            }
        }
    }

    genCert(certLink: ObjType, certTemplate: ObjType): void {
        this.yof2d = certTemplate.yof2d;
        this.recol_d_palette = certTemplate.recol_d_palette;
        this.cost = certLink.cost;
        this.stackable = 1;
        this.recol_s = certTemplate.recol_s;
        this.name = certLink.name;
        this.zoom2d = certTemplate.zoom2d;
        this.xan2d = certTemplate.xan2d;
        this.xof2d = certTemplate.xof2d;
        this.yan2d = certTemplate.yan2d;
        this.retex_s = certTemplate.retex_s;
        this.members = certLink.members;
        this.model = certTemplate.model;
        this.retex_d = certTemplate.retex_d;
        this.recol_d = certTemplate.recol_d;
        this.zan2d = certTemplate.zan2d;

        // Dynamic Exchange Description Generator
        let article = 'a';
        const c = (certLink.name || '').toLowerCase().charAt(0);
        if (c === 'a' || c === 'e' || c === 'i' || c === 'o' || c === 'u') {
            article = 'an';
        }
        this.desc = `Swap this note at any bank for ${article} ${certLink.name}.`;
    }

    genLent(lentLink: ObjType, lentTemplate: ObjType): void {
        this.xan2d = lentTemplate.xan2d;
        this.zoom2d = lentTemplate.zoom2d;
        this.name = lentLink.name;
        this.womanwearOffsetY = lentLink.womanwearOffsetY;
        this.womanwear2 = lentLink.womanwear2;
        this.yan2d = lentTemplate.yan2d;
        this.recol_d = lentLink.recol_d;
        this.manwear2 = lentLink.manwear2;
        this.xof2d = lentTemplate.xof2d;
        this.manhead2 = lentLink.manhead2;
        this.retex_d = lentLink.retex_d;
        this.womanwear = lentLink.womanwear;
        this.op = lentLink.op;
        this.manhead = lentLink.manhead;
        this.model = lentTemplate.model;
        this.members = lentLink.members;
        this.zan2d = lentTemplate.zan2d;
        this.iop = new Array(5).fill(null);
        this.manwear3 = lentLink.manwear3;
        this.womanwear3 = lentLink.womanwear3;
        this.cost = 0;
        this.womanhead = lentLink.womanhead;
        this.recol_d_palette = lentLink.recol_d_palette;
        this.womanhead2 = lentLink.womanhead2;
        this.manwear = lentLink.manwear;
        this.retex_s = lentLink.retex_s;
        this.yof2d = lentTemplate.yof2d;
        this.team = lentLink.team;
        this.manwearOffsetY = lentLink.manwearOffsetY;
        this.recol_s = lentLink.recol_s;
        this.params = lentLink.params;
        if (lentLink.iop) {
            for (let var3 = 0; var3 < 4; var3++) {
                this.iop[var3] = lentLink.iop[var3];
            }
        }
        this.iop[4] = 'Lend';
    }
}