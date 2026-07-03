import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type ChatFilterSettings from '#/network/game/server/model/ChatFilterSettings.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'

export default class ChatFilterSettingsEncoder extends ServerGameMessageEncoder<ChatFilterSettings> {
    prot = ServerGameProt.CHAT_FILTER_SETTINGS;

    encode(buf: Packet, message: ChatFilterSettings) {
        buf.p1(message.publicChatFilter);
        buf.p1(message.privateChatFilter);
        buf.p1(message.tradeChatFilter);
    }
}
