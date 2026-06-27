import ClientMessage from '#/network/client/ClientMessage.ts';

export default class EventCameraPosition extends ClientMessage {
    constructor(
        readonly pitch: number, 
        readonly yaw: number
    ) {        
        super();
    }
}
