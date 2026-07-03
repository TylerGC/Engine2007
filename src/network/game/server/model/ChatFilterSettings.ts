import { ServerGameProtPriority } from '#/network/game/server/prot/ServerGameProtPriority.ts';
import ServerGameMessage from '#/network/game/server/ServerGameMessage.ts';

export default class ChatFilterSettings extends ServerGameMessage {
    priority = ServerGameProtPriority.BUFFERED;

    // 0: Public
    // 1: Friends
    // 2: Off
    // 3: Hide
    
    // Note: In the client, you have to move mouse over the 
    // stones before they visually update after sending this packet
    constructor(
        readonly publicChatFilter: number,
        readonly privateChatFilter: number,
        readonly tradeChatFilter: number
    ) {
        super();
    }
}
