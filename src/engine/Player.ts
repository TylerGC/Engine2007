import type ServerMessage from '#/network/server/ServerMessage.ts';
import InputTracking from '#/engine/entity/tracking/InputTracking.ts';

export default class Player {
    readonly input: InputTracking;
    session: string = 'headless';
    slot: number = -1;

    x: number;
    z: number;
    level: number;

    lastTickX: number;
    lastTickZ: number;
    lastLevel: number;

    tele: boolean;
    jump: boolean;

    constructor() {
        this.input = new InputTracking(this);
        this.x = 2316;
        this.z = 3790;
        this.level = 0;

        this.lastTickX = this.x;
        this.lastTickZ = this.z;
        this.lastLevel = this.level;
        this.tele = false;
        this.jump = false;
    }

    write(_: ServerMessage) {
    }
}
