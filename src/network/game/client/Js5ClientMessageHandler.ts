import ClientSocket from '#/server/ClientSocket.ts';
import ClientGameMessage from '#/network/game/client/ClientGameMessage.js';

export default abstract class Js5ClientMessageHandler<T extends ClientGameMessage> {
    abstract handle(message: T, client: ClientSocket): boolean;
}