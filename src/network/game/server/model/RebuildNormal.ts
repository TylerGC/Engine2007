import { ServerGameProtPriority } from '#/network/game/server/prot/ServerGameProtPriority.ts';
import ServerGameMessage from '#/network/game/server/ServerGameMessage.ts';

export default class RebuildNormal extends ServerGameMessage {
    priority = ServerGameProtPriority.IMMEDIATE;

    constructor(
        readonly absX: number,
        readonly absZ: number
    ) {
        super();
    }
}
