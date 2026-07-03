import type Packet from '#/io/Packet.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.js';
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.js';
import IfButtonX from '#/network/game/client/model/IfButtonX.ts';

export default class IfButtonXDecoder extends ClientGameMessageDecoder<IfButtonX> {
    constructor(
        readonly prot: ClientGameProt,
        readonly op: number
    ) {
        super();
    }

    decode(buf: Packet) {
        const com = buf.g4();
        const sub = buf.g2();
        return new IfButtonX(this.op, (com * 65536) + sub)
    }
}
