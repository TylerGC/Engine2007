import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class OpNpcE extends ClientGameMessage {
    category = ClientGameProtCategory.USER_EVENT;
    idx: number;

    constructor(idx: number) {
        super();

        this.idx = idx;
    }
}
