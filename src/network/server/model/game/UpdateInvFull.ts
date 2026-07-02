import { Inventory } from '#/engine/Inventory.js';
import GameServerMessage from '#/network/server/GameServerMessage.ts';
import GameServerPriority from '#/network/server/prot/game/GameServerPriority.ts';

export default class UpdateInvFull extends GameServerMessage {
    priority = GameServerPriority.BUFFERED;

    constructor(
        readonly component: number,
        readonly inv: Inventory
    ) {
        super();
    }
}
