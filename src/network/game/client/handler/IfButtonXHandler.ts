import type { NetworkPlayer } from '#/engine/entity/NetworkPlayer.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.js';
import type IfButtonX from "#/network/game/client/model/IfButtonX.ts";
import Logout from "#/network/game/server/model/Logout.js";

export default class IfXButtonXHandler extends ClientGameMessageHandler<IfButtonX> {
    handle(message: IfButtonX, player: NetworkPlayer): boolean {
        //todo: runescript
        if (message.com === 11927558) {
            player.write(new Logout())
            return true;
        }
        return true;
    }
}
