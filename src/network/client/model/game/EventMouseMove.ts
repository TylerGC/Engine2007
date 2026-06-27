import ClientMessage from '#/network/client/ClientMessage.ts';

export default class EventMouseMove extends ClientMessage {
    constructor(readonly data: Uint8Array) {
        super();
    }
}
