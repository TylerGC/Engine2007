import type Packet from '#/io/Packet.ts';
import Js5ClientProt from '#/network/game/client/prot/js5/Js5ClientProt.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import PriorityChangeLow from '#/network/game/client/model/js5/PriorityChangeLow.ts';

export default class PriorityChangeLowDecoder extends ClientGameMessageDecoder<PriorityChangeLow> {
    prot = Js5ClientProt.PRIORITY_CHANGE_LOW;

    decode(buf: Packet) {
        return new PriorityChangeLow();
    }
}
