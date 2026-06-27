import type Packet from '#/io/Packet.ts';
import OpenRs2 from '#/util/OpenRs2.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';
import type RebuildNormal from '#/network/server/model/game/RebuildNormal.ts';

export default class RebuildNormalEncoder extends MessageEncoder {
    opcode = 79;
    size = -2;

    write(buf: Packet, message: RebuildNormal) {
        const x = message.absX;
        const z = message.absZ;

        const zx = x >> 3;
        const zz = z >> 3;

        // todo: helper class to get local coord
        const localX = x - ((zx - 6) << 3);
        const localZ = z - ((zz - 6) << 3);

        // todo: better key provider
        for (let mx = (zx - 6) >> 3; mx <= (zx + 6) >> 3; mx++) {
            for (let mz = (zz - 6) >> 3; mz <= (zz + 6) >> 3; mz++) {
                const key = OpenRs2.OSRS_1.getKey(mx, mz);
                for (let i = 0; i < 4; i++) {
                    buf.p4_alt1(key[i]);
                }
            }
        }

        buf.p2_alt2(zz);
        buf.p2_alt3(localX);
        buf.p2(zx);
        buf.p1_alt3(0);
        buf.p2(localZ);
    }

    test(message: RebuildNormal): number {
        const x = message.absX;
        const z = message.absZ;

        const zx = x >> 3;
        const zz = z >> 3;

        let maps = 0;
        for (let mx = (zx - 6) >> 3; mx <= (zx + 6) >> 3; mx++) {
            for (let mz = (zz - 6) >> 3; mz <= (zz + 6) >> 3; mz++) {
                maps++;
            }
        }

        return 2 + 2 + (maps * 16) + 1 + 2 + 2;
    }
}
