import type Packet from '#/io/Packet.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import OpNpc from "#/network/game/client/model/OpNpc.js";
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.js';

export default class OpNpcDecoder extends ClientGameMessageDecoder<OpNpc> {
    constructor(
        readonly prot: ClientGameProt,
        readonly op: number
    ) {
        super();
    }

    decode(buf: Packet) {
        switch (this.op) {
            case 1: {
                const npcId = buf.g2_alt2();
                return new OpNpc(1, npcId);
            }
            case 2: {
                const npcId = buf.g2();
                return new OpNpc(2, npcId);
            }
            case 3: {
                const npcId = buf.g2();
                return new OpNpc(3, npcId);
            }
            case 4: {
                const npcId = buf.g2_alt1();
                return new OpNpc(4, npcId);
            }
            case 5: {
                const npcId = buf.g2();
                return new OpNpc(5, npcId);
            }
            default:
            {
                console.error(`Unhandled 'OpNpc' op value: ${this.op}`);
                process.exit(1);
            }
        }

    }
}
