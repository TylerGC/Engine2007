import Js5Index from '#/js5/Js5Index.js';
import { loadPackFile } from '#tools/util/ConfigPackHelper.ts';
import Packet from '#/io/Packet.ts';

export class IfType {
    parentId: number = -1;
    v3: boolean = false;
 
    type: number = 0;
    buttonType: number = 0;
    clientCode: number = 0;
    width: number = 0;
    height: number = 0;
    trans: number = 0;
    overLayerId: number = -1;
    x: number = 0;
    y: number = 0;
    layerId: number = -1;
    widthAlignment: number = 0;
    heightAlignment: number = 0;
    xAlignment: number = 0;
    yAlignment: number = 0;
    hide: boolean = false;
 
    // type 0 (layer)
    scrollWidth: number = 0;
    scrollHeight: number = 0;
    noClickThrough: boolean = false;
 
    // type 1 (discarded fields to preserve exact byte-match)
    discardedField1: number | null = null;
    discardedField2: number | null = null;
 
    // type 2 / 7 (inv)
    linkObjType: Int32Array | null = null;
    linkObjNumber: Int32Array | null = null;
    marginX: number = 0;
    marginY: number = 0;
    invBackgroundX: Int16Array | null = null;
    invBackgroundY: Int16Array | null = null;
    invBackground: Int32Array | null = null;
    invBackgroundPresent: boolean[] | null = null;
    iop: (string | null)[] | null = null;
 
    // type 3 (rectangle)
    fill: boolean = false;
 
    // type 1 / 4 (text)
    hAlign: number = 0;
    vAlign: number = 0;
    lineHeight: number = 0;
    font: number = -1;
    shadow: boolean = false;
    text: string | null = '';
    text2: string | null = '';
    colour: number = 0;
    colour2: number = 0;
    colourOver: number = 0;
    colour2Over: number = 0;
 
    // type 5 (graphic)
    graphic: number = -1;
    graphic2: number = -1;
    rotate: number = 0;
    tiling: boolean = false;
    field3477: boolean = false;
    outline: number = 0;
    shadowColour: number = 0;
    vFlip: boolean = false;
    hFlip: boolean = false;
 
    // type 6 (model)
    model1Type: number = 1;
    model1Id: number = -1;
    model2Id: number = -1;
    model2Type: number = 1;
    modelAnim: number = -1;
    modelAnim2: number = -1;
    modelZoom: number = 100;
    modelXAn: number = 0;
    modelZAn: number = 0;
    modelYAn: number = 0;
    modelXOf: number = 0;
    modelYOf: number = 0;
    modelBaseWidth: number = 0;
    modelBaseHeight: number = 0;
    orthog: boolean = false;
    discardedModelField: number | null = null;
 
    // type 9 (line)
    lineWidth: number = 1;
    lineDirection: boolean = false;
 
    // buttons
    targetVerb: string | null = '';
    targetBase: string | null = '';
    buttonText: string | null = 'Ok';
    hashook: boolean = false;
    opNames: (string | null)[] | null = null;
    baseOpName: string | null = '';
    eventCode: number = 0;
    hotkeys: Int8Array | null = null;
    dragdeadzone: number = 0;
    dragdeadtime: number = 0;
    draggablebehavior: boolean = false;
    buttonTextOmitted: boolean = false;
 
    // CS2-style visibility conditions/scripts
    scripts: (Int32Array | null)[] | null = null;
    scriptComparator: Int32Array | null = null;
    scriptOperand: Int32Array | null = null;
 
    // hooks
    onload: (number | string | null)[] | null = null;
    onmouseover: (number | string | null)[] | null = null;
    onmouseleave: (number | string | null)[] | null = null;
    ontargetleave: (number | string | null)[] | null = null;
    ontargetenter: (number | string | null)[] | null = null;
    onvartransmit: (number | string | null)[] | null = null;
    oninvtransmit: (number | string | null)[] | null = null;
    onstattransmit: (number | string | null)[] | null = null;
    ontimer: (number | string | null)[] | null = null;
    onop: (number | string | null)[] | null = null;
    onmouserepeat: (number | string | null)[] | null = null;
    onclick: (number | string | null)[] | null = null;
    onclickrepeat: (number | string | null)[] | null = null;
    onrelease: (number | string | null)[] | null = null;
    onhold: (number | string | null)[] | null = null;
    ondrag: (number | string | null)[] | null = null;
    ondragcomplete: (number | string | null)[] | null = null;
    onscrollwheel: (number | string | null)[] | null = null;
    onvartransmitlist: Int32Array | null = null;
    oninvtransmitlist: Int32Array | null = null;
    onstattransmitlist: Int32Array | null = null;
 
    // custom, set by the loader after decode — not part of the wire format
    comName: string | null = null;
    overlay: boolean = false;
 
    decodeTransmitList(arg0: Packet): Int32Array | null {
        const var2 = arg0.g1();
        if (var2 === 0) {
            return null;
        }
 
        const var3 = new Int32Array(var2);
        for (let var4 = 0; var4 < var2; var4++) {
            var3[var4] = arg0.g4();
        }
        return var3;
    }
 
    decodeHook(arg0: Packet): (number | string | null)[] | null {
        const var2 = arg0.g1();
        if (var2 === 0) {
            return null;
        }
 
        const var3 = new Array(var2);
        for (let var4 = 0; var4 < var2; var4++) {
            const var5 = arg0.g1();
            if (var5 === 0) {
                var3[var4] = arg0.g4();
            } else if (var5 === 1) {
                var3[var4] = arg0.gjstr();
            }
        }
        this.hashook = true;
        return var3;
    }
 
    decode3(arg0: Packet): void {
        arg0.pos++;
        this.v3 = true;
        this.type = arg0.g1();
        this.clientCode = arg0.g2();
        this.x = arg0.g2s();
        this.y = arg0.g2s();
        this.width = arg0.g2();
        this.height = arg0.g2();
        this.widthAlignment = arg0.g1b();
        this.heightAlignment = arg0.g1b();
        this.xAlignment = arg0.g1b();
        this.yAlignment = arg0.g1b();
        this.layerId = arg0.g2();
        if (this.layerId === 65535) {
            this.layerId = -1;
        } else {
            this.layerId += this.parentId & 0xffff0000;
        }
        this.hide = arg0.g1() === 1;
 
        if (this.type === 0) {
            this.scrollWidth = arg0.g2();
            this.scrollHeight = arg0.g2();
            this.noClickThrough = arg0.g1() === 1;
        }
        if (this.type === 5) {
            this.graphic = arg0.g4();
            this.rotate = arg0.g2();
            const var2 = arg0.g1();
            this.tiling = (var2 & 0x1) !== 0;
            this.field3477 = (var2 & 0x2) !== 0;
            this.trans = arg0.g1();
            this.outline = arg0.g1();
            this.shadowColour = arg0.g4();
            this.vFlip = arg0.g1() === 1;
            this.hFlip = arg0.g1() === 1;
        }
        if (this.type === 6) {
            this.model1Type = 1;
            this.model1Id = arg0.g2();
            if (this.model1Id === 65535) {
                this.model1Id = -1;
            }
            this.modelXOf = arg0.g2s();
            this.modelYOf = arg0.g2s();
            this.modelXAn = arg0.g2();
            this.modelYAn = arg0.g2();
            this.modelZAn = arg0.g2();
            this.modelZoom = arg0.g2();
            this.modelAnim = arg0.g2();
            if (this.modelAnim === 65535) {
                this.modelAnim = -1;
            }
            this.orthog = arg0.g1() === 1;
            this.discardedModelField = arg0.g2();
            if (this.widthAlignment !== 0) {
                this.modelBaseWidth = arg0.g2();
            }
            if (this.heightAlignment !== 0) {
                this.modelBaseHeight = arg0.g2();
            }
        }
        if (this.type === 4) {
            this.font = arg0.g2();
            if (this.font === 65535) {
                this.font = -1;
            }
            this.text = arg0.gjstr();
            this.lineHeight = arg0.g1();
            this.hAlign = arg0.g1();
            this.vAlign = arg0.g1();
            this.shadow = arg0.g1() === 1;
            this.colour = arg0.g4();
        }
        if (this.type === 3) {
            this.colour = arg0.g4();
            this.fill = arg0.g1() === 1;
            this.trans = arg0.g1();
        }
        if (this.type === 9) {
            this.lineWidth = arg0.g1();
            this.colour = arg0.g4();
            this.lineDirection = arg0.g1() === 1;
        }
 
        this.eventCode = arg0.g3();
        const var3 = arg0.g1();
        if (var3 > 0) {
            this.hotkeys = new Int8Array(var3);
            for (let var4 = 0; var4 < var3; var4++) {
                this.hotkeys[var4] = arg0.g1b();
            }
        }
        this.baseOpName = arg0.gjstr();
        const var5 = arg0.g1();
        if (var5 > 0) {
            this.opNames = new Array(var5);
            for (let var6 = 0; var6 < var5; var6++) {
                this.opNames[var6] = arg0.gjstr();
            }
        }
        this.dragdeadzone = arg0.g1();
        this.dragdeadtime = arg0.g1();
        this.draggablebehavior = arg0.g1() === 1;
        this.targetVerb = arg0.gjstr();
        this.onload = this.decodeHook(arg0);
        this.onmouseover = this.decodeHook(arg0);
        this.onmouseleave = this.decodeHook(arg0);
        this.ontargetleave = this.decodeHook(arg0);
        this.ontargetenter = this.decodeHook(arg0);
        this.onvartransmit = this.decodeHook(arg0);
        this.oninvtransmit = this.decodeHook(arg0);
        this.onstattransmit = this.decodeHook(arg0);
        this.ontimer = this.decodeHook(arg0);
        this.onop = this.decodeHook(arg0);
        this.onmouserepeat = this.decodeHook(arg0);
        this.onclick = this.decodeHook(arg0);
        this.onclickrepeat = this.decodeHook(arg0);
        this.onrelease = this.decodeHook(arg0);
        this.onhold = this.decodeHook(arg0);
        this.ondrag = this.decodeHook(arg0);
        this.ondragcomplete = this.decodeHook(arg0);
        this.onscrollwheel = this.decodeHook(arg0);
        this.onvartransmitlist = this.decodeTransmitList(arg0);
        this.oninvtransmitlist = this.decodeTransmitList(arg0);
        this.onstattransmitlist = this.decodeTransmitList(arg0);
    }
 
    decode(arg0: Packet): void {
        this.v3 = false;
        this.type = arg0.g1();
        this.buttonType = arg0.g1();
        this.clientCode = arg0.g2();
        this.x = arg0.g2s();
        this.y = arg0.g2s();
        this.width = arg0.g2();
        this.height = arg0.g2();
        this.heightAlignment = 0;
        this.widthAlignment = 0;
        this.xAlignment = 0;
        this.yAlignment = 0;
        this.trans = arg0.g1();
        this.layerId = arg0.g2();
        if (this.layerId === 65535) {
            this.layerId = -1;
        } else {
            this.layerId = (this.parentId & 0xffff0000) + this.layerId;
        }
        this.overLayerId = arg0.g2();
        if (this.overLayerId === 65535) {
            this.overLayerId = -1;
        }
 
        const var2 = arg0.g1();
        if (var2 > 0) {
            this.scriptOperand = new Int32Array(var2);
            this.scriptComparator = new Int32Array(var2);
            for (let var3 = 0; var3 < var2; var3++) {
                this.scriptComparator[var3] = arg0.g1();
                this.scriptOperand[var3] = arg0.g2();
            }
        }
 
        const var4 = arg0.g1();
        if (var4 > 0) {
            this.scripts = new Array(var4).fill(null);
            for (let var5 = 0; var5 < var4; var5++) {
                const var6 = arg0.g2();
                this.scripts[var5] = new Int32Array(var6);
                for (let var7 = 0; var7 < var6; var7++) {
                    this.scripts[var5]![var7] = arg0.g2();
                    if (this.scripts[var5]![var7] === 65535) {
                        this.scripts[var5]![var7] = -1;
                    }
                }
            }
        }
 
        if (this.type === 0) {
            this.scrollHeight = arg0.g2();
            this.hide = arg0.g1() === 1;
        }
        if (this.type === 1) {
            this.discardedField1 = arg0.g2();
            this.discardedField2 = arg0.g1();
        }
        if (this.type === 2) {
            this.linkObjType = new Int32Array(this.width * this.height);
            this.linkObjNumber = new Int32Array(this.height * this.width);
            this.heightAlignment = 3;
            this.widthAlignment = 3;
            const var8 = arg0.g1();
            if (var8 === 1) {
                this.eventCode |= 0x10000000;
            }
            const var9 = arg0.g1();
            if (var9 === 1) {
                this.eventCode |= 0x40000000;
            }
            const var10 = arg0.g1();
            if (var10 === 1) {
                this.eventCode |= -2147483648;
            }
            const var11 = arg0.g1();
            if (var11 === 1) {
                this.eventCode |= 0x20000000;
            }
            this.marginX = arg0.g1();
            this.marginY = arg0.g1();
            this.invBackground = new Int32Array(20);
            this.invBackgroundY = new Int16Array(20);
            this.invBackgroundX = new Int16Array(20);
            this.invBackgroundPresent = new Array(20).fill(false);
            for (let var12 = 0; var12 < 20; var12++) {
                const var13 = arg0.g1();
                if (var13 === 1) {
                    this.invBackgroundX[var12] = arg0.g2s();
                    this.invBackgroundY[var12] = arg0.g2s();
                    this.invBackground[var12] = arg0.g4();
                    this.invBackgroundPresent[var12] = true;
                } else {
                    this.invBackground[var12] = -1;
                }
            }
            this.iop = new Array(5).fill(null);
            for (let var14 = 0; var14 < 5; var14++) {
                const var15 = arg0.gjstr();
                if (var15.length > 0) {
                    this.iop[var14] = var15;
                    this.eventCode |= 0x1 << (var14 + 23);
                }
            }
        }
        if (this.type === 3) {
            this.fill = arg0.g1() === 1;
        }
        if (this.type === 4 || this.type === 1) {
            this.hAlign = arg0.g1();
            this.vAlign = arg0.g1();
            this.lineHeight = arg0.g1();
            this.font = arg0.g2();
            if (this.font === 65535) {
                this.font = -1;
            }
            this.shadow = arg0.g1() === 1;
        }
        if (this.type === 4) {
            this.text = arg0.gjstr();
            this.text2 = arg0.gjstr();
        }
        if (this.type === 1 || this.type === 3 || this.type === 4) {
            this.colour = arg0.g4();
        }
        if (this.type === 3 || this.type === 4) {
            this.colour2 = arg0.g4();
            this.colourOver = arg0.g4();
            this.colour2Over = arg0.g4();
        }
        if (this.type === 5) {
            this.graphic = arg0.g4();
            this.graphic2 = arg0.g4();
        }
        if (this.type === 6) {
            this.model1Type = 1;
            this.model1Id = arg0.g2();
            this.model2Type = 1;
            if (this.model1Id === 65535) {
                this.model1Id = -1;
            }
            this.model2Id = arg0.g2();
            if (this.model2Id === 65535) {
                this.model2Id = -1;
            }
            this.modelAnim = arg0.g2();
            if (this.modelAnim === 65535) {
                this.modelAnim = -1;
            }
            this.modelAnim2 = arg0.g2();
            if (this.modelAnim2 === 65535) {
                this.modelAnim2 = -1;
            }
            this.modelZoom = arg0.g2();
            this.modelXAn = arg0.g2();
            this.modelYAn = arg0.g2();
        }
        if (this.type === 7) {
            this.heightAlignment = 3;
            this.linkObjType = new Int32Array(this.width * this.height);
            this.widthAlignment = 3;
            this.linkObjNumber = new Int32Array(this.width * this.height);
            this.hAlign = arg0.g1();
            this.font = arg0.g2();
            if (this.font === 65535) {
                this.font = -1;
            }
            this.shadow = arg0.g1() === 1;
            this.colour = arg0.g4();
            this.marginX = arg0.g2s();
            this.marginY = arg0.g2s();
            const var16 = arg0.g1();
            this.iop = new Array(5).fill(null);
            if (var16 === 1) {
                this.eventCode |= 0x40000000;
            }
            for (let var17 = 0; var17 < 5; var17++) {
                const var18 = arg0.gjstr();
                if (var18.length > 0) {
                    this.iop[var17] = var18;
                    this.eventCode |= 0x1 << (var17 + 23);
                }
            }
        }
        if (this.type === 8) {
            this.text = arg0.gjstr();
        }
        if (this.buttonType === 2 || this.type === 2) {
            this.targetVerb = arg0.gjstr();
            this.targetBase = arg0.gjstr();
            const var19 = arg0.g2() & 0x3f;
            this.eventCode |= var19 << 11;
        }
        if (this.buttonType === 1 || this.buttonType === 4 || this.buttonType === 5 || this.buttonType === 6) {
            this.buttonText = arg0.gjstr();
            if (this.buttonText.length === 0) {
                this.buttonTextOmitted = true;
                if (this.buttonType === 1) {
                    this.buttonText = 'OK';
                }
                if (this.buttonType === 4) {
                    this.buttonText = 'Select';
                }
                if (this.buttonType === 5) {
                    this.buttonText = 'Select';
                }
                if (this.buttonType === 6) {
                    this.buttonText = 'Continue';
                }
            }
        }
        if (this.buttonType === 1 || this.buttonType === 4 || this.buttonType === 5) {
            this.eventCode |= 0x400000;
        }
        if (this.buttonType === 6) {
            this.eventCode |= 0x1;
        }
    }
    
    get rootLayer(): number {
        return this.parentId & 0xffff0000;
    }
}
 
export function decodeComponent(compData: Uint8Array, parentId: number): { comp: IfType; consumed: number; isV3: boolean } {
    const comp = new IfType();
    comp.parentId = parentId;
 
    const isV3 = (compData[0] << 24) >> 24 === -1;
    const packet = new Packet(compData);
    if (isV3) {
        comp.decode3(packet);
    } else {
        comp.decode(packet);
    }
 
    return { comp, consumed: packet.pos, isV3 };
}

export default class Component {
    private static components: Map<number, IfType> = new Map();
    private static nameToId: Map<string, number> = new Map();
 
    static load(index: Js5Index): void {
        this.components = new Map();
        this.nameToId = new Map();
 
        const idToName = loadPackFile('interface.pack');
        if (idToName.size === 0) {
            throw new Error(
                'Component.load: pack/interface.pack is missing or empty. ' +
                'Generate it (e.g. via unpack.ts) before loading Component.'
            );
        }
        let nextId = 0;
 
        for (let groupId = 0; groupId < index.capacity; groupId++) {
            if (!index.isGroupValid(groupId)) {
                continue;
            }
 
            if (!index.packed[groupId] || Object.keys(index.unpacked[groupId] ?? {}).length === 0) {
                if (!index.unpackGroup(groupId)) {
                    continue;
                }
            }
 
            const interfaceNameId = nextId++;
            const interfaceName = idToName.get(interfaceNameId);
            if (interfaceName === undefined) {
                throw new Error(
                    `Component.load: interface.pack has no entry for id ${interfaceNameId} (interface group ${groupId}). ` +
                    `interface.pack is out of date - regenerate it before running the compiler.`
                );
            }

            this.nameToId.set(interfaceName, groupId);
 
            const compCount = index.groupSize[groupId];
            const compFileIds = index.fileIds[groupId];
 
            for (let i = 0; i < compCount; i++) {
                const compId = compFileIds ? compFileIds[i] : i;
                const compData = index.unpacked[groupId]?.[compId];
                if (!compData) {
                    continue;
                }
 
                const nameId = nextId++;
                const fullName = idToName.get(nameId);
                if (fullName === undefined) {
                    throw new Error(
                        `Component.load: interface.pack has no entry for id ${nameId} (group ${groupId}, component ${compId}). ` +
                        `interface.pack is out of date - regenerate it before running the compiler.`
                    );
                }
 
                const realId = compId + (groupId << 16);
 
                try {
                    const { comp } = decodeComponent(compData, realId);
                    comp.comName = fullName;
                    // Every interface can be an overlay in this revision... maybe? It looks to be entirely server-sided
                    comp.overlay = true;
                    this.components.set(realId, comp);
                    this.nameToId.set(fullName, realId);
                } catch (err) {
                    console.error(`Component.load: failed to decode group ${groupId}, component ${compId} ('${fullName}')`, err);
                }
            }
        }
    }
 
    static get(id: number): IfType {
        const com = this.components.get(id);
        if (!com) {
            throw new Error(`Component.get: no component loaded for id ${id}`);
        }
        return com;
    }
 
    static getId(fullName: string): number {
        return this.nameToId.get(fullName) ?? -1;
    }
 
    static allComponents(): ReadonlyMap<number, IfType> {
        return this.components;
    }
 
    static allNames(): ReadonlyMap<string, number> {
        return this.nameToId;
    }
}
