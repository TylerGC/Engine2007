import type Packet from '#/io/Packet.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import EventMouseClick from '#/network/game/client/model/EventMouseClick.ts';
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.js';

export default class EventMouseClickDecoder extends ClientGameMessageDecoder<EventMouseClick> {
    prot = ClientGameProt.EVENT_MOUSE_CLICK;

    decode(buf: Packet, length: number) {
        const info = buf.g4_alt2(); 

        return new EventMouseClick(info);
    }
}
