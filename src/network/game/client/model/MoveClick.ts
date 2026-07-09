import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class MoveClick extends ClientGameMessage {
    category = ClientGameProtCategory.USER_EVENT;

    constructor(
        readonly path: { x: number; z: number }[],
        readonly ctrlHeld: number,
        readonly opClick: boolean
    ) {
        super();
    }
}
