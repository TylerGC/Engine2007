import type Packet from '#/io/Packet.ts';
import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import MessagePublic from '#/network/client/model/game/MessagePublic.ts';

export default class MessagePublicDecoder extends MessageDecoder {
    opcode = 189;
    size = -1;
    limit = GameClientLimit.USER;

    read(buf: Packet, length: number): ClientMessage {
        const colour = buf.g1();
        const effect = buf.g1();

        const input = buf.data.subarray(buf.pos, buf.pos + length - 2);
        buf.pos += length - 2;

        return new MessagePublic(colour, effect, input);
    }
}
