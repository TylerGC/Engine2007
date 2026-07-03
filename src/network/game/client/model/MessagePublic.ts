import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class MessagePublic extends ClientGameMessage {
    category = ClientGameProtCategory.USER_EVENT;
    constructor(
        readonly colour: number,
        readonly effect: number,
        readonly input: Uint8Array
    ) {
        super();
    }
}
