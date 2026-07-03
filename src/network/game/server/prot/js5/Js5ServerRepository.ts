import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.js';
import ServerGameMessage from '#/network/game/server/ServerGameMessage.js';

import Js5GroupResponseEncoder from '#/network/game/server/codec/js5/Js5GroupResponseEncoder.ts';
import Js5GroupResponse from '#/network/game/server/model/js5/Js5GroupResponse.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */
type GenericOutgoingMessage<T extends ServerGameMessage> = new (...args: any[]) => T;

class Js5ServerRepository {
    private encoders: Map<GenericOutgoingMessage<ServerGameMessage>, ServerGameMessageEncoder<ServerGameMessage>> = new Map();

    protected bind<T extends ServerGameMessage>(message: GenericOutgoingMessage<T>, encoder: ServerGameMessageEncoder<T>) {
        if (this.encoders.has(message)) {
            throw new Error(`[ServerProtRepository] Already defines a ${message.name}.`);
        }
        this.encoders.set(message, encoder);
    }

    getEncoder<T extends ServerGameMessage>(message: T): ServerGameMessageEncoder<T> | undefined {
        return this.encoders.get(message.constructor as GenericOutgoingMessage<T>);
    }

    constructor() {
        this.bind(Js5GroupResponse, new Js5GroupResponseEncoder());
    }

}
export default new Js5ServerRepository();