import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class XorChange extends ClientGameMessage {
    category = ClientGameProtCategory.CLIENT_EVENT;
    key: number;

    constructor(key: number) {
        super();

        this.key = key;
    }
}
