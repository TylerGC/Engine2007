import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type Logout from '#/network/game/server/model/Logout.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'

export default class LogoutEncoder extends ServerGameMessageEncoder<Logout> {
    prot = ServerGameProt.LOGOUT;

    encode(buf: Packet, message: Logout) {}
}
