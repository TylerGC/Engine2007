import { ServerGameProtPriority } from '#/network/game/server/prot/ServerGameProtPriority.ts';
import ServerGameMessage from '#/network/game/server/ServerGameMessage.ts';

export default class SynthSound extends ServerGameMessage {
    priority = ServerGameProtPriority.BUFFERED;

    constructor(
        readonly id: number,
        readonly loops: boolean,
        readonly delay: number
    ) {
        super();
    }
}
