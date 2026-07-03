export default class Js5ServerProt {
    static byId: Js5ServerProt[] = [];

    static readonly PREFETCH_REQUEST = new Js5ServerProt(-1, -2);

    constructor(
        readonly id: number,
        readonly length: number
    ) {
        Js5ServerProt.byId[id] = this;
    }
}
