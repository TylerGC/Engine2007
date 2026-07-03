import { ServerGameProtPriority } from '#/network/game/server/prot/ServerGameProtPriority.ts';
import ServerGameMessage from '#/network/game/server/ServerGameMessage.ts';

export default class UpdateRunEnergy extends ServerGameMessage {
    priority = ServerGameProtPriority.BUFFERED;

    constructor(
        readonly value: number
    ) {
        super();
    }
}
