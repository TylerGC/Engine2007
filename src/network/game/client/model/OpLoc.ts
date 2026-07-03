import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class OpLoc extends ClientGameMessage {
    category = ClientGameProtCategory.USER_EVENT;
    op: number;
    locId: number;
    x: number;
    z: number;

    constructor(op: number, locId: number, x: number, z: number) {
        super();
        this.op = op;
        this.locId = locId;
        this.x = x;
        this.z = z;
    }
}
