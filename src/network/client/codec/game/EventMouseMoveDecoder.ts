import type Packet from '#/io/Packet.ts';
import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import EventMouseMove from '#/network/client/model/game/EventMouseMove.ts';

export default class EventMouseMoveDecoder extends MessageDecoder {
    opcode = 111; 
    size = -1;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet, length: number): ClientMessage {
        const data = new Uint8Array(length);
        buf.gdata(data, 0, length);

        return new EventMouseMove(data);
    }
}
