import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class OpLocE extends ClientGameMessage {
    category = ClientGameProtCategory.USER_EVENT;
    id: number;

    constructor(id: number) {
        super();

        this.id = id;
    }
}
