import type Packet from '#/io/Packet.ts';
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.js';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import OpNpcE from "#/network/game/client/model/OpNpcE.js";

export default class OpNpcEDecoder extends ClientGameMessageDecoder<OpNpcE> {
    prot = ClientGameProt.OPNPCE;

    decode(buf: Packet) {
        const idx = buf.g2_alt1();
        return new OpNpcE(idx);
    }
}
