import type Packet from '#/io/Packet.ts';
import Js5ClientProt from '#/network/game/client/prot/js5/Js5ClientProt.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import PrefetchRequest from '#/network/game/client/model/js5/PrefetchRequest.ts';

export default class PrefetchRequestDecoder extends ClientGameMessageDecoder<PrefetchRequest> {
    prot = Js5ClientProt.PREFETCH_REQUEST;

    decode(buf: Packet) {
        const archive = buf.g1();
        const group = buf.g2();

        return new PrefetchRequest(archive, group);
    }
}
