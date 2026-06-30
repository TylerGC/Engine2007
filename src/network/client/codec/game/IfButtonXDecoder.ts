import type Packet from '#/io/Packet.ts';

import type ClientMessage from '#/network/client/ClientMessage.ts';
import GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';
import IfXButton from "#/network/client/model/game/IfXButton.ts";

export default class IfButtonXDecoder extends MessageDecoder {
    opcode: number;
    size = 6;
    limit = GameClientLimit.CLIENT;
    op: number;

    constructor(op: number, opcode: number) {
        super();

        this.op = op;
        this.opcode = opcode;
    }

    read(buf: Packet): ClientMessage {
        const com = buf.g4();
        const sub = buf.g2();
        return new IfXButton(this.op, (com * 65536) + sub)
    }
}
