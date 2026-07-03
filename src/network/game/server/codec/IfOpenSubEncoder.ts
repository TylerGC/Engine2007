import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type IfOpenSub from '#/network/game/server/model/IfOpenSub.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'

export default class IfOpenSubEncoder extends ServerGameMessageEncoder<IfOpenSub> {
    prot = ServerGameProt.IF_OPENSUB;

    encode(buf: Packet, message: IfOpenSub) {
        buf.p4(message.interfaceId);
        buf.p2(message.subInterfaceId);
        buf.p1(message.type);
    }
}
