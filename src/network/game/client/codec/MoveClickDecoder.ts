import type Packet from '#/io/Packet.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import MoveClick from '#/network/game/client/model/MoveClick.ts';
import ClientGameProt from '#/network/game/client/prot/ClientGameProt.js';

export default class MoveClickDecoder extends ClientGameMessageDecoder<MoveClick> {
    constructor(
        readonly prot: ClientGameProt,
    ) {
        super();
    }

    decode(buf: Packet, length: number) {
        const offset = this.prot.id === ClientGameProt.MOVE_MINIMAPCLICK.id ? 14 : 0; // extra input data when clicking minimap
        const waypoints = (length - 3 - offset) / 2;

        const startZ = buf.g2();
        const ctrlHeld = buf.g1_alt2();

        const path = [];
        for (let i = 1; i < waypoints; i++) {
            const x = buf.g1b_alt3();
            const z = buf.g1b_alt2();

            path.push({ x, z });
        }

        const startX = buf.g2_alt2();

        if (this.prot.id === ClientGameProt.MOVE_MINIMAPCLICK.id) {
            buf.pos += 14;
        }

        if (path.length === 0) {
            path.push({ x: startX, z: startZ });
        } else {
            for (let i = 0; i < path.length; i++) {
                path[i].x += startX;
                path[i].z += startZ;
            }
        }

        return new MoveClick(path, ctrlHeld, ctrlHeld == 1);
    }
}
