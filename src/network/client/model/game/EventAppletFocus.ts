import ClientMessage from '#/network/client/ClientMessage.ts';

export default class EventAppletFocus extends ClientMessage {

    constructor(
        readonly focus: number
    ) {
        super();
    }
}
