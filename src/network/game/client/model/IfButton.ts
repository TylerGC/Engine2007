import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class IfButton extends ClientGameMessage {
    category = ClientGameProtCategory.USER_EVENT;
    com: number;

    constructor(com: number) {
        super();

        this.com = typeof com === 'undefined' ? 0 : com;
    }
}
