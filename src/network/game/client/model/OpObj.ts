import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class OpObj extends ClientGameMessage {
    category = ClientGameProtCategory.USER_EVENT;
    op: number;
    com: number;
    parent: number;
    id: number;

    constructor(op: number, com: number, parent: number, id: number) {
        super();
        this.op = op;
        this.com = com;
        this.parent = parent;
        this.id = id;
    }
}
