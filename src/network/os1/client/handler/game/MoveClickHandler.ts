import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type MoveClick from '#/network/client/model/game/MoveClick.ts';
import RebuildNormal from '#/network/server/model/game/RebuildNormal.ts';

export default class MoveClickHandler extends MessageHandler {
    handle(message: MoveClick, player: NetworkPlayer): boolean {
        if (!message.path.length) {
            return true;
        }

        const dest = message.path[0];

        player.x = dest.x;
        player.z = dest.z;

        player.write(new RebuildNormal(dest.x, dest.z));
        return true;
    }
}
