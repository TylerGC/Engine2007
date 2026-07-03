import type Packet from '#/io/Packet.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import ClientCheat from '#/network/game/client/model/ClientCheat.ts';
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.js';

export default class ClientCheatDecoder extends ClientGameMessageDecoder<ClientCheat> {
    prot = ClientGameProt.CLIENT_CHEAT;

    decode(buf: Packet) {
        const input = buf.gjstr();

        return new ClientCheat(input);
    }
}
