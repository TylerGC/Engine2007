import type { NetworkPlayer } from '#/engine/entity/NetworkPlayer.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.js';
import OpObj from '#/network/game/client/model/OpObj.js';

export default class OpObjHandler extends ClientGameMessageHandler<OpObj> {
    handle(message: OpObj, player: NetworkPlayer): boolean {
        // todo
        return true;
    }
}
