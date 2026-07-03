import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type UpdateStat from '#/network/game/server/model/UpdateStat.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'

export default class UpdateStatEncoder extends ServerGameMessageEncoder<UpdateStat> {
    prot = ServerGameProt.UPDATE_STAT;

    encode(buf: Packet, message: UpdateStat) {
        buf.p1_alt2(message.id);
        buf.p1_alt1(message.level);
        buf.p4_alt3(message.experience)
    }
}
