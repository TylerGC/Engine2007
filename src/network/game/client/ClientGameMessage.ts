import ClientMessage from '#/network/ClientMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default abstract class ClientGameMessage extends ClientMessage {
    abstract readonly category: ClientGameProtCategory;
}
