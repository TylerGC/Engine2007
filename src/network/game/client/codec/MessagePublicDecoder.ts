import type Packet from '#/io/Packet.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import MessagePublic from '#/network/game/client/model/MessagePublic.ts';
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.js';

export default class MessagePublicDecoder extends ClientGameMessageDecoder<MessagePublic> {
    prot = ClientGameProt.MESSAGE_PUBLIC;

    decode(buf: Packet, length: number) {
        const colour = buf.g1();
        const effect = buf.g1();

        const input = buf.data.subarray(buf.pos, buf.pos + length - 2);
        buf.pos += length - 2;

        return new MessagePublic(colour, effect, input);
    }
}
