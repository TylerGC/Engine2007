export default class ServerGameZoneProt {
    static byId: ServerGameZoneProt[] = [];

    constructor(
        readonly id: number,
        readonly length: number
    ) {
        ServerGameZoneProt.byId[id] = this;
    }
}