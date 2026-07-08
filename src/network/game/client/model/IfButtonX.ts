import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class IfButtonX extends ClientGameMessage {
    category = ClientGameProtCategory.USER_EVENT;
    op: number;
    com: number;
    sub: number;

    constructor(op: number, com?: number, sub: number = -1) {
        super();

        this.op = typeof com === 'undefined' ? 0 : op;
        this.com = typeof com === 'undefined' ? op : com;
        this.sub = sub;
    }
}
