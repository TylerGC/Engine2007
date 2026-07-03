import { Inventory } from '#/engine/Inventory.js';
import { ServerGameProtPriority } from '#/network/game/server/prot/ServerGameProtPriority.ts';
import ServerGameMessage from '#/network/game/server/ServerGameMessage.ts';

export default class UpdateInvFull extends ServerGameMessage {
    priority = ServerGameProtPriority.BUFFERED;

    constructor(
        readonly component: number,
        readonly inv: Inventory
    ) {
        super();
    }
}
