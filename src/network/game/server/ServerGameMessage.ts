import { ServerGameProtPriority } from '#/network/game/server/prot/ServerGameProtPriority.ts';
import ServerMessage from '#/network/ServerMessage.js';

export default abstract class ServerGameMessage extends ServerMessage {
    abstract readonly priority: ServerGameProtPriority;
}