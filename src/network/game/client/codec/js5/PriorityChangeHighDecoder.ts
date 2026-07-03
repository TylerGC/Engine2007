import type Packet from '#/io/Packet.ts';
import Js5ClientProt from '#/network/game/client/prot/js5/Js5ClientProt.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import PriorityChangeHigh from '#/network/game/client/model/js5/PriorityChangeHigh.ts';

export default class PriorityChangeLowDecoder extends ClientGameMessageDecoder<PriorityChangeHigh> {
    prot = Js5ClientProt.PRIORITY_CHANGE_HIGH;

    decode(buf: Packet) {
        return new PriorityChangeHigh();
    }
}
