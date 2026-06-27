import type Packet from '#/io/Packet.ts';
import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import EventAppletFocus from '#/network/client/model/game/EventAppletFocus.ts';

export default class EventAppletFocusDecoder extends MessageDecoder {
    opcode = 130; 
    size = 1;
    limit = GameClientLimit.CLIENT;

    read(buf: Packet, length: number): ClientMessage {
        const focus = buf.g1();

        return new EventAppletFocus(focus);
    }
}
