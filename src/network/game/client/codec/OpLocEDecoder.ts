import type Packet from '#/io/Packet.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import OpLocE from "#/network/game/client/model/OpLocE.ts";
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.js';

export default class OpLocEDecoder extends ClientGameMessageDecoder<OpLocE> {
    prot = ClientGameProt.OPLOCE;

    decode(buf: Packet) {
        const id = buf.g2();
        return new OpLocE(id);
    }
}
