import type ServerMessage from '#/network/server/ServerMessage.ts';
import InputTracking from '#/engine/entity/tracking/InputTracking.ts';
import Packet from '#/io/Packet.ts';

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

    // chat
    socialProtect: boolean = false;
    muted_until: Date | null = null;
    chatColour: number | null = null;
    chatEffect: number | null = null;
    chatRights: number | null = null;
    staffModLevel: number = 0;
    logMessage: string | null = null;
    chatMessage: Uint8Array | null = null;

    reportAbuseProtect: boolean = false;
    protect: boolean = false;
    repathed: boolean = false;

    appearanceBuf: Uint8Array | null = null;

    masks: number = 0;

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

    resetEntity(respawn: boolean) {
        // if (respawn) {
        //     this.unfocus();
        // }
        // super.resetPathingEntity();
        this.repathed = false;
        this.protect = false;
        this.chatColour = null;
        this.chatEffect = null;
        this.chatRights = null;
        this.chatMessage = null;
        this.logMessage = null;
        this.socialProtect = false;
        this.reportAbuseProtect = false;
    }

    generateAppearance(): Uint8Array {
        const stream = Packet.alloc(64);

        stream.p1(0);
        stream.p1(-1);
        stream.p1(-1);

        // worn inv
        stream.p1(0);
        stream.p2(0);
        stream.p2(0);
        stream.p2(0);
        stream.p2(0);
        stream.p1(0);
        stream.p2(0);
        stream.p1(0);
        stream.p1(0);
        stream.p2(0);
        stream.p1(0);
        stream.p2(0);

        // colors
        stream.p1(0);
        stream.p1(0);
        stream.p1(0);
        stream.p1(0);
        stream.p1(0);

        // anims
        stream.p2(-1);
        stream.p2(-1);
        stream.p2(-1);
        stream.p2(-1);
        stream.p2(-1);
        stream.p2(-1);
        stream.p2(-1);

        stream.p8(0x184881n); // username
        stream.p1(3);  // combatLevel

        const appearance = new Uint8Array(stream.pos);
        stream.pos = 0;
        stream.gdata(appearance, 0, appearance.length);
        stream.release();

        this.appearanceBuf = appearance;
        return appearance;
    }
}
