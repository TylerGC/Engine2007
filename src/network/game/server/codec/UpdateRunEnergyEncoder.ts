import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type UpdateRunEnergy from '#/network/game/server/model/UpdateRunEnergy.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'

export default class UpdateRunEnergyEncoder extends ServerGameMessageEncoder<UpdateRunEnergy> {
    prot = ServerGameProt.UPDATE_RUNENERGY;

    encode(buf: Packet, message: UpdateRunEnergy) {
        buf.p1(message.value);
    }
}
