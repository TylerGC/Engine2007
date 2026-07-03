import type { NetworkPlayer } from '#/engine/entity/NetworkPlayer.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.js';
import type OpLoc from "#/network/game/client/model/OpLoc.js";

export default class OpOLocandler extends ClientGameMessageHandler<OpLoc> {
    handle(message: OpLoc, player: NetworkPlayer): boolean {
        // todo
        return true;
    }
}
