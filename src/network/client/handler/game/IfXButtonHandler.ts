import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type IfXButton from "#/network/client/model/game/IfXButton.ts";
import Logout from "#/network/server/model/game/Logout.js";

export default class IfXButtonHandler extends MessageHandler {
    handle(message: IfXButton, player: NetworkPlayer): boolean {
        //todo: runescript
        if (message.com === 11927558) {
            player.write(new Logout())
            return true;
        }
        return true;
    }
}
