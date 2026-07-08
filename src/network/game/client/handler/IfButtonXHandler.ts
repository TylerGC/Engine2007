import type { NetworkPlayer } from '#/engine/entity/NetworkPlayer.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.js';
import type IfButtonX from "#/network/game/client/model/IfButtonX.ts";
import Logout from "#/network/game/server/model/Logout.js";
import { hasOp } from '#/cache/config/Component.ts';
import Component from '#/cache/config/Component.ts';
import ScriptProvider from '#/engine/script/ScriptProvider.ts';
import ScriptState from '#/engine/script/ScriptState.ts';
import ScriptRunner from '#/engine/script/ScriptRunner.ts';
import Environment from '#/util/Environment.ts';
import { printError } from '#/util/Logger.ts';
import ServerTriggerType from '#/engine/script/ServerTriggerType.ts';

const buttonTriggers = [
    ServerTriggerType.IF_BUTTON1,
    ServerTriggerType.IF_BUTTON2,
    ServerTriggerType.IF_BUTTON3,
    ServerTriggerType.IF_BUTTON4,
    ServerTriggerType.IF_BUTTON5
];

export default class IfXButtonXHandler extends ClientGameMessageHandler<IfButtonX> {
    handle(message: IfButtonX, player: NetworkPlayer): boolean {
        //todo: runescript
        if (message.com === 11927558) {
            player.write(new Logout())
            return true;
        }

        const { com: comId, op, sub: sub } = message;

        if (sub !== -1) {
            if (Environment.NODE_DEBUG) {
                printError(`This is probably important...`);
            }
            return false;
        }

        const com = Component.get(comId);
        if (typeof com === 'undefined' || !hasOp(com, op)) {
            // bad client: component didn't declare this op
            return false;
        } else if (!player.isComponentVisible(com)) {
            // bad client or lag: component is not visible
            return false;
        }

        player.lastCom = comId;

        if (player.resumeButtons.indexOf(player.lastCom) !== -1) {
            if (player.activeScript && player.activeScript.execution === ScriptState.PAUSEBUTTON) {
                player.executeScript(player.activeScript, true, true);
            }
        } else {
            let script = op >= 1 && op <= 5
                ? ScriptProvider.getByTrigger(buttonTriggers[op - 1], comId, -1)
                : undefined;

            if (script) {
                const root = Component.get(com.rootLayer);
                player.executeScript(ScriptRunner.init(script, player), root.overlay == false);
            } else if (Environment.NODE_DEBUG) {
                player.messageGame(`No trigger for [if_button${op},${com.comName}]`);
            }
        }

        return true;
    }
}
