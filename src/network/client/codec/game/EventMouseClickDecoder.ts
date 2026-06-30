import type Packet from '#/io/Packet.ts';
import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import EventMouseClick from '#/network/client/model/game/EventMouseClick.ts';

export default class EventMouseClickDecoder extends MessageDecoder {
    opcode = 63;
    size = 4;
    limit = GameClientLimit.USER;

    read(buf: Packet, length: number): ClientMessage {
        const info = buf.g4_alt2(); 

        return new EventMouseClick(info);
    }
}
