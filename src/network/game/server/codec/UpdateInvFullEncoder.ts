import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type UpdateInvFull from '#/network/game/server/model/UpdateInvFull.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'
import Component from '#/cache/config/Component.ts';

export default class UpdateInvFullEncoder extends ServerGameMessageEncoder<UpdateInvFull> {
    prot = ServerGameProt.UPDATE_INV_FULL;

    encode(buf: Packet, message: UpdateInvFull) {
        const { component, inv } = message;

        const comType = Component.get(component);
        const size = Math.min(inv.capacity, comType.width * comType.height);

        buf.p4(component);
        buf.p2(inv.type);
        buf.p2(size);

        for (let slot = 0; slot < size; slot++) {
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
