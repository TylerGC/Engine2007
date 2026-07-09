import type { NetworkPlayer } from '#/engine/entity/NetworkPlayer.ts';
import OpenRs2 from '#/util/OpenRs2.ts';
import type MoveClick from '#/network/game/client/model/MoveClick.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.js';
import RebuildNormal from '#/network/game/server/model/RebuildNormal.ts';
import { CoordGrid } from '#/engine/CoordGrid.ts';
import Environment from '#/util/Environment.ts';

export default class MoveClickHandler extends ClientGameMessageHandler<MoveClick> {
    handle(message: MoveClick, player: NetworkPlayer): boolean {
        // if (!message.path.length) {
        //     return true;
        // }

        // let destX = message.path[message.path.length - 1].x;
        // let destZ = message.path[message.path.length - 1].z;

        // const missingKeys = OpenRs2.RS2_500.getMissingKeysForRebuild(destX, destZ);
        // if (missingKeys.length > 0) {
        //     const keyList = missingKeys.map(key => `${key.x}_${key.z}`).join(', ');
        //     console.warn(`Blocked movement rebuild to ${destX},${destZ}; missing XTEA keys for ${keyList}`);
        //     return true;
        // }

        // player.write(new RebuildNormal(destX, destZ));
        // return true;

        if (player.delayed) {
            //player.write(new UnsetMapFlag());
            return false;
        }

        console.log("get handled, nerd")

        const start = message.path[0];

        // Validate input
        if (message.ctrlHeld < 0 || message.ctrlHeld > 1 || CoordGrid.distanceToSW(player, { x: start.x, z: start.z }) > 104) {
            player.unsetMapFlag();
            player.userPath = [];
            return false;
        }

        // Clear previous interaction — but not for op-click moves.
        // A MOVE_OPCLICK is always paired with a following op packet that clears+sets
        // the interaction itself. Clearing here would drop the target in the gap when
        // the per-tick user packet limit splits the pair across ticks.
        if (!message.opClick) {
            player.clearPendingAction();
        }

        // Handle ctrl run
        if (player.runenergy < 100 && message.ctrlHeld === 1) {
            player.tempRun = 0;
        } else {
            player.tempRun = message.ctrlHeld;
        }

        // Set new path
        //if (Environment.node.clientRoutefinder) {
            player.userPath = [];

            for (let i = 0; i < message.path.length; i++) {
                player.userPath[i] = CoordGrid.packCoord(player.level, message.path[i].x, message.path[i].z);
            }
            player.queueWaypoints(player.userPath);

            player.processWalktrigger();
        //} else {
        //     const dest = message.path[message.path.length - 1];
        //     player.queueWaypoints(findPath(player.level, player.x, player.z, dest.x, dest.z));
        // }

        return true;
    }
}
