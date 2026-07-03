import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class OpPlayer extends ClientGameMessage {
    category = ClientGameProtCategory.USER_EVENT;
    op: number;
    idx: number;

    constructor(op: number, idx: number) {
        super();
        this.op = op;
        this.idx = idx;
    }
}
