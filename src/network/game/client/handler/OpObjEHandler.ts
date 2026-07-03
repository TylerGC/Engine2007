import type { NetworkPlayer } from '#/engine/entity/NetworkPlayer.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.js';
import OpObjE from '#/network/game/client/model/OpObjE.ts';

export default class OpObjEHandler extends ClientGameMessageHandler<OpObjE> {
    handle(message: OpObjE, player: NetworkPlayer): boolean {
        // todo
        return true;
    }
}
