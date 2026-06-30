import type ServerMessage from '#/network/server/ServerMessage.ts';
import InputTracking from '#/engine/entity/tracking/InputTracking.ts';
import Packet from '#/io/Packet.ts';
import { PlayerInfoProt } from '#/network/rsbuf/prot.ts';
import { fromBase37, toBase37 } from '#/util/JString.ts';

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

    username: string;
    username37: bigint;

    masks: number = 0;
    gender: number = 0;
    skullIcon: number = -1;
    prayerIcon: number = -1;

    body: number[] = [
        0, // hair
        10, // beard
        18, // body
        26, // arms
        33, // gloves
        36, // legs
        42 // boots
    ];
    colors: number[] = [0, 0, 0, 0, 0];

    constructor(username: string, username37: bigint) {
        this.input = new InputTracking(this);
        this.x = 2316;
        this.z = 3790;
        this.level = 0;

        this.username = "jahoobies";
        this.username37 = toBase37(this.username);

        this.lastTickX = this.x;
        this.lastTickZ = this.z;
        this.lastLevel = this.level;
        this.tele = false;
        this.jump = false;
        // Not the place for this but oh well
        this.masks |= PlayerInfoProt.APPEARANCE;
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

        let gender = this.gender;
        stream.p1(gender);
        
        if ((gender & 0x2) === 2) {
            stream.p1(0);
            stream.p1(0);
        }

        stream.p1(this.skullIcon);
        stream.p1(this.prayerIcon);

        const skippedSlots = [];

        // real stripped down worn
        for (let slot = 0; slot < 12; slot++) {

            const appearanceValue = this.getAppearanceInSlot(slot);
            if (appearanceValue < 1) {
                stream.p1(0);
            } else {
                stream.p2(appearanceValue);
            }
        }

        // colors
        for (let i = 0; i < this.colors.length; i++) {
            stream.p1(this.colors[i]);
        }

        // anims
        stream.p2(0x328);
        stream.p2(0x337);
        stream.p2(0x333);
        stream.p2(0x334);
        stream.p2(0x335);
        stream.p2(0x336);
        stream.p2(0x338);

        stream.p8(this.username37); // username
        stream.p1(3);  // combatLevel
        stream.p2(0);  // skillLevel

        const appearance = new Uint8Array(stream.pos);
        stream.pos = 0;
        stream.gdata(appearance, 0, appearance.length);
        stream.release();

        this.appearanceBuf = appearance;
        return appearance;
    }

    getAppearanceInSlot(slot: number) {
        let part = -1;
        if (slot === 8) {
            part = this.body[0];
        } else if (slot === 11) {
            part = this.body[1];
        } else if (slot === 4) {
            part = this.body[2];
        } else if (slot === 6) {
            part = this.body[3];
        } else if (slot === 9) {
            part = this.body[4];
        } else if (slot === 7) {
            part = this.body[5];
        } else if (slot === 10) {
            part = this.body[6];
        }

        if (part === -1) {
            return 0;
        } else {
            return 0x100 + part;
        }
    }
}