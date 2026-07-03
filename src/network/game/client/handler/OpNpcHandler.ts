import type { NetworkPlayer } from '#/engine/entity/NetworkPlayer.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.js';
import type OpNpc from "#/network/game/client/model/OpNpc.js";

export default class OpONpcandler extends ClientGameMessageHandler<OpNpc> {
    handle(message: OpNpc, player: NetworkPlayer): boolean {
        // todo
        return true;
    }
}
