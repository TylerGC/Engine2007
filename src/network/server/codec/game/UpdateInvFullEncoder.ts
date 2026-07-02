import Packet from '#/io/Packet.js';
import type UpdateInvFull from '#/network/server/model/game/UpdateInvFull.ts';
import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';

export default class UpdateInvFullEncoder extends MessageEncoder {
    opcode = 186;
    size = -2;

    write(buf: Packet, message: UpdateInvFull) {
        const { component, inv } = message;

        // const comType = Component.get(component);
        // const size = Math.min(inv.capacity, comType.width * comType.height); todo

        buf.p4(component);
        buf.p2(inv.type);
        buf.p2(inv.capacity);

        for (let slot = 0; slot < inv.capacity; slot++) {
            const obj = inv.get(slot);

            if (obj) {
                buf.p2_alt2(obj.id + 1);

                if (obj.count >= 255) {
                    buf.p1_alt3(255);
                    buf.p4_alt1(obj.count);
                } else {
                    buf.p1_alt3(obj.count);
                }
            } else {
                buf.p2_alt2(0);
                buf.p1_alt3(0);
            }
        }
    }
}
