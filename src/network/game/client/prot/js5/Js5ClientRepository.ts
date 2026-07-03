import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import Js5ClientMessageHandler from '#/network/game/client/Js5ClientMessageHandler.ts';
import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';

import PrefetchRequestDecoder from '#/network/game/client/codec/js5/PrefetchRequestDecoder.ts';
import PriorityChangeHighDecoder from '#/network/game/client/codec/js5/PriorityChangeHighDecoder.ts';
import PriorityChangeLowDecoder from '#/network/game/client/codec/js5/PriorityChangeLowDecoder.ts';
import UrgentRequestDecoder from '#/network/game/client/codec/js5/UrgentRequestDecoder.ts';
import XorChangeDecoder from '#/network/game/client/codec/js5/XorChangeDecoder.ts';
import PrefetchRequestHandler from '#/network/game/client/handler/js5/PrefetchRequestHandler.ts';
import PriorityChangeHighHandler from '#/network/game/client/handler/js5/PriorityChangeHighHandler.ts';
import PriorityChangeLowHandler from '#/network/game/client/handler/js5/PriorityChangeLowHandler.ts';
import UrgentRequestHandler from '#/network/game/client/handler/js5/UrgentRequestHandler.ts';
import XorChangeHandler from '#/network/game/client/handler/js5/XorChangeHandler.ts';

class Js5ClientRepository {
    decoders: Map<number, ClientGameMessageDecoder<ClientGameMessage>> = new Map();
    handlers: Map<number, Js5ClientMessageHandler<ClientGameMessage>> = new Map();

    protected bind(decoder: ClientGameMessageDecoder<ClientGameMessage>, handler?: Js5ClientMessageHandler<ClientGameMessage>) {
        if (this.decoders.has(decoder.prot.id)) {
            throw new Error(`[ClientProtRepository] Already defines a ${decoder.prot.id}.`);
        }
        this.decoders.set(decoder.prot.id, decoder);
        if (handler) {
            this.handlers.set(decoder.prot.id, handler);
        }
    }

    getDecoder(id: number) {
        return this.decoders.get(id);
    }

    getHandler(id: number) {
        return this.handlers.get(id);
    }

    constructor() {
        this.bind(new PrefetchRequestDecoder(), new PrefetchRequestHandler());
        this.bind(new UrgentRequestDecoder(), new UrgentRequestHandler());
        this.bind(new PriorityChangeHighDecoder(), new PriorityChangeHighHandler());
        this.bind(new PriorityChangeLowDecoder(), new PriorityChangeLowHandler());
        this.bind(new XorChangeDecoder(), new XorChangeHandler());
    }
}
export default new Js5ClientRepository();