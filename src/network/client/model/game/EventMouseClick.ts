import ClientMessage from '#/network/client/ClientMessage.ts';

export default class EventMouseClick extends ClientMessage {
    constructor(readonly info: number) {
        super();
    }
}
