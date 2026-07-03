import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class EventMouseMove extends ClientGameMessage {
    category = ClientGameProtCategory.CLIENT_EVENT;
    constructor(readonly data: Uint8Array) {
        super();
    }
}
