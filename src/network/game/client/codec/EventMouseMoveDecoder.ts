import type Packet from '#/io/Packet.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import EventMouseMove from '#/network/game/client/model/EventMouseMove.ts';
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.js';

export default class EventMouseMoveDecoder extends ClientGameMessageDecoder<EventMouseMove> {
    prot = ClientGameProt.EVENT_MOUSE_MOVE

    decode(buf: Packet, length: number) {
        const data = new Uint8Array(length);
        buf.gdata(data, 0, length);

        return new EventMouseMove(data);
    }
}
