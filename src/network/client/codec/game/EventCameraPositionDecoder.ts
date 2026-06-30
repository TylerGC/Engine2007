import type Packet from '#/io/Packet.ts';
import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import EventCameraPosition from '#/network/client/model/game/EventCameraPosition.ts';

export default class EventCameraPositionDecoder extends MessageDecoder {
    opcode = 173; 
    size = 4;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet, length: number): ClientMessage {
        const yaw = buf.g2_alt2(); 
        const pitch = buf.g2();

        return new EventCameraPosition(pitch, yaw);
    }
}
