import type ServerMessage from '#/network/server/ServerMessage.ts';
import InputTracking from '#/engine/entity/tracking/InputTracking.ts';

export default class Player {
    readonly input: InputTracking;
    session: string = 'headless';

    constructor() {
        this.input = new InputTracking(this);
    }

    write(_: ServerMessage) {
    }
}
