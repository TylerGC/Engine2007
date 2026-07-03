import type Packet from '#/io/Packet.ts';
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.js';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import OpObjE from "#/network/game/client/model/OpObjE.js";

export default class OpObjEDecoder extends ClientGameMessageDecoder<OpObjE> {
    prot = ClientGameProt.OPOBJE;

    decode(buf: Packet) {
        const idx = buf.g2_alt2();
        return new OpObjE(idx);
    }
}
