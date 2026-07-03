import type Packet from '#/io/Packet.ts';
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.js';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import OpObj from "#/network/game/client/model/OpObj.js";

export default class OpObjDecoder extends ClientGameMessageDecoder<OpObj> {
    constructor(
        readonly prot: ClientGameProt,
        readonly op: number
    ) {
        super();
    }

    decode(buf: Packet) {
        switch (this.op) {
            case 1: {
                const com = buf.g4_alt3();
                const parent = buf.g2_alt1();
                const id = buf.g2_alt3();
                return new OpObj(1, com, parent, id);
            }
            case 2: {
                const com = buf.g4_alt3();
                const parent = buf.g2_alt3();
                const id = buf.g2();
                return new OpObj(2, com, parent, id);
            }
            case 3: {
                const id = buf.g2_alt1();
                const parent = buf.g2_alt2();
                const com = buf.g4_alt3();
                return new OpObj(3, com, parent, id);
            }
            case 4: {
                const parent = buf.g2();
                const id = buf.g2();
                const com = buf.g4();
                return new OpObj(4, com, parent, id);
            }
            case 5: {
                const com = buf.g4();
                const id = buf.g2_alt3();
                const parent = buf.g2_alt3();
                return new OpObj(5, com, parent, id);
            }
            default:
            {
                console.error(`Unhandled 'OpObj' op value: ${this.op}`);
                process.exit(1);
            }
        }

    }
}
