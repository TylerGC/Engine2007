import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class ClientCheat extends ClientGameMessage {
    category = ClientGameProtCategory.USER_EVENT;
    input: string;

    constructor(input: string) {
        super();

        this.input = input;
    }
}
