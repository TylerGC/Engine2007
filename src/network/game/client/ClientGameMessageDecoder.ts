import Packet from '#/io/Packet.js';
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.ts';
import ClientGameMessage from '#/network/game/client/ClientGameMessage.js';

export default abstract class ClientGameMessageDecoder<T extends ClientGameMessage> {
    abstract prot: ClientGameProt;

    abstract decode(buf: Packet, len: number): T;
}
