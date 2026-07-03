import type Packet from '#/io/Packet.ts';
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.js';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import EventCameraPosition from '#/network/game/client/model/EventCameraPosition.ts';

export default class EventCameraPositionDecoder extends ClientGameMessageDecoder<EventCameraPosition> {
    prot = ClientGameProt.EVENT_CAMERA_POSITION;

    decode(buf: Packet, length: number) {
        const yaw = buf.g2_alt2(); 
        const pitch = buf.g2();

        return new EventCameraPosition(pitch, yaw);
    }
}
