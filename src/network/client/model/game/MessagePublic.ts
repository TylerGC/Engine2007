import ClientMessage from '#/network/client/ClientMessage.ts';

export default class MessagePublic extends ClientMessage {
    constructor(
        readonly colour: number,
        readonly effect: number,
        readonly input: Uint8Array
    ) {
        super();
    }
}
