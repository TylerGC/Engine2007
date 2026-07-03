import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class EventCameraPosition extends ClientGameMessage {
    category = ClientGameProtCategory.CLIENT_EVENT;
    constructor(
        readonly pitch: number, 
        readonly yaw: number
    ) {        
        super();
    }
}
