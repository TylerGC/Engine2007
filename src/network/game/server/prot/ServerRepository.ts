import type ServerMessage from '#/network/server/ServerMessage.ts';
import type MessageEncoder from '#/network/server/codec/MessageEncoder.ts';

type ServerMessageConstructor = new (...args: any[]) => ServerMessage;

export default class ServerRepository {
    private encoders: Map<ServerMessageConstructor, MessageEncoder> = new Map();

    protected bind(message: ServerMessageConstructor, encoder: MessageEncoder) {
        this.encoders.set(message, encoder);
    }

    getEncoder(message: ServerMessage): MessageEncoder | undefined {
        return this.encoders.get(message.constructor as ServerMessageConstructor);
    }
}
