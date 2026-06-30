import Packet from '#/io/Packet.ts';

import MessageEncoder from '#/network/server/codec/MessageEncoder.ts';
import type PlayerInfo from '#/network/server/model/game/PlayerInfo.ts';

export default class PlayerInfoEncoder extends MessageEncoder {
    opcode = 116;
    size = -2;

    write(buf: Packet, message: PlayerInfo) {
        buf.pdata(message.bytes, 0, message.bytes.length);
    }

    test(_: PlayerInfo): number {
        return 500; // todo
    }
}
