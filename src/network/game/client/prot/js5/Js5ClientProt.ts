export default class Js5ClientProt {
    static byId: Js5ClientProt[] = [];

    static readonly PREFETCH_REQUEST = new Js5ClientProt(0, 3);
    static readonly URGENT_REQUEST = new Js5ClientProt(1, 3);
    static readonly PRIORITY_CHANGE_HIGH = new Js5ClientProt(2, 3);
    static readonly PRIORITY_CHANGE_LOW = new Js5ClientProt(3, 3);
    static readonly XOR_CHANGE = new Js5ClientProt(4, 3);

    constructor(
        readonly id: number,
        readonly length: number
    ) {
        Js5ClientProt.byId[id] = this;
    }
}