import { ServerGameProtPriority } from '#/network/game/server/prot/ServerGameProtPriority.ts';
import ServerGameMessage from '#/network/game/server/ServerGameMessage.ts';

export default class PlayerInfo extends ServerGameMessage {
    priority = ServerGameProtPriority.IMMEDIATE;

    constructor(readonly bytes: Uint8Array) {
        super();
    }
}
