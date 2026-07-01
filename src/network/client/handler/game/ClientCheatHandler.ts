import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import ClientCheat from '#/network/client/model/game/ClientCheat.ts';
import IfOpenSub from '#/network/server/model/game/IfOpenSub.ts';
import RebuildNormal from '#/network/server/model/game/RebuildNormal.ts';
import OpenRs2 from '#/util/OpenRs2.ts';

export default class ClientCheatHandler extends MessageHandler {
    handle(message: ClientCheat, player: NetworkPlayer): boolean {
        const [command, ...args] = message.input.toLowerCase().split(' ');

        if (command === 'openoverlay') {
            if (args.length < 1) {
                player.messageGame('usage: openoverlay (sub interface) (optional: interface, child)');
                player.messageGame('example: openoverlay 0, openoverlay 0 548 77');
                return true;
            }

            const subInterfaceId = parseInt(args[0]) & 0xFFFF;

            let interfaceId = 548;
            let child = 77;
            if (args.length > 2) {
                interfaceId = parseInt(args[0]) & 0xFFFF;
                child = parseInt(args[1]) & 0xFFFF;
            }

            player.write(new IfOpenSub((interfaceId << 16) | child, subInterfaceId, 0));
        } else if (command === 'tele') {
            if (args.length < 1) {
                player.messageGame('usage: tele (x) (z)');
                player.messageGame('example: tele 3222 3222');
                return true;
            }
            const missingKeys = OpenRs2.RS2_500.getMissingKeysForRebuild(parseInt(args[0]),parseInt(args[1]));
            if (missingKeys.length > 0) {
                const keyList = missingKeys.map(key => `${key.x}_${key.z}`).join(', ');
                player.messageGame(`Blocked movement rebuild; missing XTEA keys for ${keyList}`);
                return true;
            }
            player.write(new RebuildNormal(parseInt(args[0]), parseInt(args[1])));
        }

        return true;
    }
}
