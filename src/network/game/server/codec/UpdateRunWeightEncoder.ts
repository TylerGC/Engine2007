import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type UpdateRunWeight from '#/network/game/server/model/UpdateRunWeight.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'

export default class UpdateRunWeightEncoder extends ServerGameMessageEncoder<UpdateRunWeight> {
    prot = ServerGameProt.UPDATE_RUNWEIGHT;

    encode(buf: Packet, message: UpdateRunWeight) {
        buf.p2(message.value);
    }
}
