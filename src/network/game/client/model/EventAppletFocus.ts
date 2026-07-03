import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class EventAppletFocus extends ClientGameMessage {
category = ClientGameProtCategory.CLIENT_EVENT;
    constructor(
        readonly focus: number
    ) {
        super();
    }
}
