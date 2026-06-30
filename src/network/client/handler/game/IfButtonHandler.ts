import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import Logout from '#/network/server/model/game/Logout.ts';
import type IfButton from '../../model/game/IfButton.ts';

export default class IfButtonHandler extends MessageHandler {
    handle(message: IfButton, player: NetworkPlayer): boolean {
        console.log(`IfButtonHandler: ${message.com}`);
         if (message.com === 11927558) {
            player.write(new Logout())
            return true;
        }
        return true;
    }
}
