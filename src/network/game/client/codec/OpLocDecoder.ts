import type Packet from '#/io/Packet.ts';
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.js';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import OpLoc from "#/network/game/client/model/OpLoc.js";

export default class OpLocDecoder extends ClientGameMessageDecoder<OpLoc> {
    constructor(
        readonly prot: ClientGameProt,
        readonly op: number
    ) {
        super();
    }

    decode(buf: Packet) {
        switch (this.op) {
            case 1: {
                const locId = buf.g2();
                const z = buf.g2_alt3();
                const x = buf.g2_alt3();
                return new OpLoc(1, locId, x, z);
            }
            case 2: {
                const locId = buf.g2_alt3();
                const x = buf.g2_alt1();
                const z = buf.g2_alt1();
                return new OpLoc(2, locId, x, z);
            }
            case 3: {
                const x = buf.g2_alt2();
                const z = buf.g2();
                const locId = buf.g2_alt3();
                return new OpLoc(3, locId, x, z);
            }
            case 4: {
                const z = buf.g2_alt3();
                const locId = buf.g2_alt3();
                const x = buf.g2_alt1();
                return new OpLoc(4, locId, x, z);
            }
            case 5: {
                const z = buf.g2();
                const locId = buf.g2_alt3();
                const x = buf.g2_alt3();
                return new OpLoc(5, locId, x, z);
            }
            case 6: {
                const x = buf.g2_alt3();
                const z = buf.g2_alt1();
                const locId = buf.g2_alt3();
                return new OpLoc(6, locId, x, z);
            }
            case 7: {
                const z = buf.g2_alt2();
                const locId = buf.g2_alt3();
                const x = buf.g2_alt1();
                return new OpLoc(7, locId, x, z);
            }
            default:
            {
                console.error(`Unhandled 'OpLoc' op value: ${this.op}`);
                process.exit(1);
            }
        }
    }
}
