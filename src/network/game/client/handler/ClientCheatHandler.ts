import type { NetworkPlayer } from '#/engine/entity/NetworkPlayer.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.js';
import ClientCheat from '#/network/game/client/model/ClientCheat.ts';
import IfOpenSub from '#/network/game/server/model/IfOpenSub.ts';
import RebuildNormal from '#/network/game/server/model/RebuildNormal.ts';
import OpenRs2 from '#/util/OpenRs2.ts';
import ObjType from '#/cache/config/ObjType.ts';
import InvType from '#/cache/config/InvType.ts';
import Environment from '#/util/Environment.ts';
import { tryParseInt } from '#/util/TryParse.ts';

export default class ClientCheatHandler extends ClientGameMessageHandler<ClientCheat> {
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
        } else if (command === 'givecrap') {
                // authentic (we don't know the exact specifics of this...)

                // Fills your inventory with random items
                for (let i = 0; i < 28; i++) {
                    let random = -1;
                    while (random === -1) {
                        random = Math.trunc(Math.random() * ObjType.count);
                        const obj = ObjType.get(random);
                        if ((!Environment.NODE_MEMBERS && obj.members) || obj.dummyitem !== 0 || obj.certtemplate !== -1) {
                            random = -1;
                        }
                    }

                    player.invAdd(InvType.INV, random, 1, false);
                }
            } else if (command === 'givemany') {
                // authentic
                if (args.length < 1) {
                    // ::givemany <item>
                    // Adds up to 1000 of the item to your inventory
                    return false;
                }

                const obj = ObjType.getId(args[0]);
                if (obj === -1) {
                    return false;
                }

                player.invAdd(InvType.INV, obj, 1000, false);
            } else if (command === 'give') {
                // authentic
                if (args.length < 1) {
                    // ::give <item> (amount)
                    // Adds the items(s) to your inventory
                    return false;
                }

                const obj = ObjType.getId(args[0]);
                if (obj === -1) {
                    return false;
                }

                const count = Math.max(1, Math.min(tryParseInt(args[1], 1), 0x7fffffff));
                player.invAdd(InvType.INV, obj, count, false);
            } 

        return true;
    }
}
