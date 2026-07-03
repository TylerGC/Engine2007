import Packet from '#/io/Packet.js';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts';
import ServerGameMessage from '#/network/game/server/ServerGameMessage.js';

export default abstract class ServerGameMessageEncoder<T extends ServerGameMessage> {
    abstract prot: ServerGameProt;
    usable: boolean = true;

    abstract encode(buf: Packet, message: T): void;

    test(_: T): number {
        return this.prot.length;
    }
}
