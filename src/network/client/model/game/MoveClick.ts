import ClientMessage from '#/network/client/ClientMessage.ts';

export default class MoveClick extends ClientMessage {
    constructor(
        readonly path: { x: number; z: number }[],
        readonly ctrlHeld: number,
        readonly opClick: boolean
    ) {
        super();
    }
}
