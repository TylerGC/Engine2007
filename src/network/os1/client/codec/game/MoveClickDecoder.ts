import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';

import MoveClick from '#/network/client/model/game/MoveClick.ts';

export default class MoveClickDecoder extends MessageDecoder {
    opcode = -1;
    size = -1;
    limit = GameClientLimit.USER;

    constructor(opcode: number) {
        super();

        this.opcode = opcode;
    }

    read(buf: Packet, length: number): ClientMessage {
        const offset = this.opcode === 199 ? 14 : 0;
        const startZ = buf.g2();
        const ctrlHeld = buf.g1_alt2();   

        const waypointsStartPos = buf.pos;

        buf.pos = length - offset - 2;
        const startX = buf.g2_alt2();

        buf.pos = waypointsStartPos;

        const waypoints = (length - offset - 5) / 2;

        const path: { x: number; z: number }[] = [{ x: startX, z: startZ }];

        for (let index = 1; index <= waypoints && index < 25; index++) {
            const dx = buf.g1b_alt3(); 
            const dz = buf.g1b_alt2(); 

            path.push({
                x: startX + dx,
                z: startZ + dz
            });
        }

        const opClick = this.opcode === 159;

        return new MoveClick(path, ctrlHeld, opClick);
    }
}
