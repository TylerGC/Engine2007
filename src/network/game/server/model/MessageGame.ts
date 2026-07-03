import { ServerGameProtPriority } from '#/network/game/server/prot/ServerGameProtPriority.ts';
import ServerGameMessage from '#/network/game/server/ServerGameMessage.ts';

export default class MessageGame extends ServerGameMessage {
    priority = ServerGameProtPriority.BUFFERED;

    constructor(
        readonly message: string
    ) {
        super();
    }
}
