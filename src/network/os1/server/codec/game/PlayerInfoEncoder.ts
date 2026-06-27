import Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';
import type PlayerInfo from '#/network/server/model/game/PlayerInfo.ts';

export default class PlayerInfoEncoder extends MessageEncoder {
    opcode = 116;
    size = -2;

    write(buf: Packet, _message: PlayerInfo) {
        // local
        buf.bits();
        buf.pBit(1, 1);    // has info
        buf.pBit(2, 3);    // tele
        buf.pBit(1, 1);    // telejump
        buf.pBit(2, 0);    // player level
        buf.pBit(1, 1);    // has extended info
        buf.pBit(7, 54);   // localX
        buf.pBit(7, 54);   // localZ

        // old vis
        buf.pBit(8, 0);

        // new vis
        buf.pBit(11, 2047);
        buf.bytes();

        // extended info
        const info = 0x40; // Appearance update mask
        buf.p1(info);
        if ((info & 0x40) !== 0) {
            const appearance = Packet.alloc(100);
            appearance.p1(0); // gender
            appearance.p1(-1); // pk headicon
            appearance.p1(-1); // prayer headicon

            for (let i = 0; i < 12; i++) {
                appearance.p1(0);
            }

            for (let i = 0; i < 5; i++) {
                appearance.p1(0);
            }

            appearance.p2(-1); // readyanim
            appearance.p2(-1); // turn-on-spot anim
            appearance.p2(-1); // walkanim
            appearance.p2(-1); // walkanim_b
            appearance.p2(-1); // walkanim_l
            appearance.p2(-1); // walkanim_r
            appearance.p2(-1); // runanim
            appearance.p8(1020628n); // 8-byte username hash
            appearance.p1(3); // combat level

            buf.p1(appearance.pos);
            buf.pdata(appearance.data, 0, appearance.pos);
            appearance.release();
        }
    }

    test(_: PlayerInfo): number {
        return 500; // todo
    }
}
