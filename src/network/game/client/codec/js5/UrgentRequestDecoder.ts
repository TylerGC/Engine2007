import type Packet from '#/io/Packet.ts';
import Js5ClientProt from '#/network/game/client/prot/js5/Js5ClientProt.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import UrgentRequest from '#/network/game/client/model/js5/UrgentRequest.ts';

export default class UrgentRequestDecoder extends ClientGameMessageDecoder<UrgentRequest> {
    prot = Js5ClientProt.URGENT_REQUEST;

    decode(buf: Packet) {
        const archive = buf.g1();
        const group = buf.g2();

        return new UrgentRequest(archive, group);
    }
}
