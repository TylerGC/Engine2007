import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type IfOpenTop from '#/network/game/server/model/IfOpenTop.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'

export default class IfOpenTopEncoder extends ServerGameMessageEncoder<IfOpenTop> {
    prot = ServerGameProt.IF_OPENTOP;

    encode(buf: Packet, message: IfOpenTop) {
        buf.p1(0);
        buf.p2_alt3(message.interfaceId);
    }
}
