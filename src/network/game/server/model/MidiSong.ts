import { ServerGameProtPriority } from '#/network/game/server/prot/ServerGameProtPriority.ts';
import ServerGameMessage from '#/network/game/server/ServerGameMessage.ts';

export default class MidiSong extends ServerGameMessage {
    priority = ServerGameProtPriority.BUFFERED;

    constructor(
        readonly id: number
    ) {
        super();
    }
}
