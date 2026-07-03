import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type PlayerInfo from '#/network/game/server/model/PlayerInfo.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'

export default class PlayerInfoEncoder extends ServerGameMessageEncoder<PlayerInfo> {
    prot = ServerGameProt.PLAYER_INFO;

    encode(buf: Packet, message: PlayerInfo) {
        buf.pdata(message.bytes, 0, message.bytes.length);
    }

    test(_: PlayerInfo): number {
        return 500; // todo
    }
}
