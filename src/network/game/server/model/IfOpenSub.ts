import { ServerGameProtPriority } from '#/network/game/server/prot/ServerGameProtPriority.ts';
import ServerGameMessage from '#/network/game/server/ServerGameMessage.ts';

export default class IfOpenSub extends ServerGameMessage {
    priority = ServerGameProtPriority.IMMEDIATE;

    constructor(
        readonly interfaceId: number,
        readonly subInterfaceId: number,
        readonly type: number
    ) {
        super();
    }
}
