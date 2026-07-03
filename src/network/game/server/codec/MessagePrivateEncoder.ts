import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type MessagePrivate from '#/network/game/server/model/MessagePrivate.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'

export default class MessagePrivateEncoder extends ServerGameMessageEncoder<MessagePrivate> {
    prot = ServerGameProt.MESSAGE_PRIVATE;
    usable = false;
    encode(buf: Packet, message: MessagePrivate) {
        buf.pjstr(message.senderName)
        buf.p2(message.senderId)
        buf.p3(message.messageId)
        buf.p1(message.senderRights)
        //todo: psmart(len)
        //todo: huffman encoded message.message
    }
}
