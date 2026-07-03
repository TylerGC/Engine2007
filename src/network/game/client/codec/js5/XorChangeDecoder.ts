import type Packet from '#/io/Packet.ts';
import Js5ClientProt from '#/network/game/client/prot/js5/Js5ClientProt.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import XorChange from '#/network/game/client/model/js5/XorChange.ts';

export default class XorChangeDecoder extends ClientGameMessageDecoder<XorChange> {
    prot = Js5ClientProt.XOR_CHANGE;

    decode(buf: Packet) {
        const key = buf.g1();

        return new XorChange(key);
    }
}
