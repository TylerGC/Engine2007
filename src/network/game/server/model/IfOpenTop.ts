import { ServerGameProtPriority } from '#/network/game/server/prot/ServerGameProtPriority.ts';
import ServerGameMessage from '#/network/game/server/ServerGameMessage.ts';

export default class IfOpenTop extends ServerGameMessage {
    priority = ServerGameProtPriority.IMMEDIATE;

    constructor(
        readonly interfaceId: number
    ) {
        super();
    }
}
