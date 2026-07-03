import type { NetworkPlayer } from '#/engine/entity/NetworkPlayer.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.js';
import Logout from '#/network/game/server/model/Logout.ts';
import type IfButton from '#/network/game/client/model/IfButton.ts';

export default class IfButtonHandler extends ClientGameMessageHandler<IfButton> {
    handle(message: IfButton, player: NetworkPlayer): boolean {
        console.log(`IfButtonHandler: ${message.com}`);
         if (message.com === 11927558) {
            player.write(new Logout())
            return true;
        }
        return true;
    }
}
