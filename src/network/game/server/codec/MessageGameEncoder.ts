import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type MessageGame from '#/network/game/server/model/MessageGame.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'

export default class MessageGameEncoder extends ServerGameMessageEncoder<MessageGame> {
    prot = ServerGameProt.MESSAGE_GAME;

    encode(buf: Packet, message: MessageGame) {
        buf.pjstr(message.message)
    }
}
