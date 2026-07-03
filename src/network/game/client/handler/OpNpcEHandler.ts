import type { NetworkPlayer } from '#/engine/entity/NetworkPlayer.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.js';
import type OpNpcE from "#/network/game/client/model/OpNpcE.js";

export default class OpONpcEandler extends ClientGameMessageHandler<OpNpcE> {
    handle(message: OpNpcE, player: NetworkPlayer): boolean {
        // todo
        return true;
    }
}
