import type { NetworkPlayer } from '#/engine/entity/NetworkPlayer.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.js';
import type OpLocE from "#/network/game/client/model/OpLocE.ts";

export default class OpLocEHandler extends ClientGameMessageHandler<OpLocE> {
    handle(message: OpLocE, player: NetworkPlayer): boolean {
        // todo
        return true;
    }
}
