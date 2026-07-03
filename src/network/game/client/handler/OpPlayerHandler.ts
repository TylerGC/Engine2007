import type { NetworkPlayer } from '#/engine/entity/NetworkPlayer.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.js';
import OpPlayer from '#/network/game/client/model/OpPlayer.js';

export default class OpPlayerHandler extends ClientGameMessageHandler<OpPlayer> {
    handle(message: OpPlayer, player: NetworkPlayer): boolean {
        // todo
        return true;
    }
}
