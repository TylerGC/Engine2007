import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class MoveClick extends ClientGameMessage {
    category = ClientGameProtCategory.USER_EVENT;
    // todo: make a routefind type?
    route: { x: number, z: number }[];
    ctrlHeld: boolean;

    constructor(route: { x: number, z: number }[], ctrlHeld: boolean) {
        super();

        this.route = route;
        this.ctrlHeld = ctrlHeld;
    }
}
