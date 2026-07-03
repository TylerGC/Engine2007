import { ServerGameProtPriority } from '#/network/game/server/prot/ServerGameProtPriority.ts';
import ServerGameMessage from '#/network/game/server/ServerGameMessage.ts';

export default class MessagePrivate extends ServerGameMessage {
    priority = ServerGameProtPriority.BUFFERED;

    constructor(
        readonly senderName: string,
        readonly message: string,
        readonly senderId: number, //verify
        readonly messageId: number, //verify
        readonly senderRights: number,
    ) {
        super();
    }
}
