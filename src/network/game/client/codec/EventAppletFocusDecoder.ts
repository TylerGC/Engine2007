import type Packet from '#/io/Packet.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import EventAppletFocus from '#/network/game/client/model/EventAppletFocus.ts';
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.js';

export default class EventAppletFocusDecoder extends ClientGameMessageDecoder<EventAppletFocus> {
    prot = ClientGameProt.EVENT_APPLET_FOCUS;

    decode(buf: Packet, length: number) {
        const focus = buf.g1();

        return new EventAppletFocus(focus);
    }
}
