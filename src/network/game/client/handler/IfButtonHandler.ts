import type { NetworkPlayer } from '#/engine/entity/NetworkPlayer.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.js';
import type IfButton from '#/network/game/client/model/IfButton.ts';
import Logout from '#/network/game/server/model/Logout.ts';
import Component from '#/cache/config/Component.ts';
import ScriptProvider from '#/engine/script/ScriptProvider.ts';
import ScriptState from '#/engine/script/ScriptState.ts';
import ScriptRunner from '#/engine/script/ScriptRunner.ts';
import ServerTriggerType from '#/engine/script/ServerTriggerType.ts';
import Environment from '#/util/Environment.ts';
import { printError } from '#/util/Logger.ts';

// buttonType 2 (Target) is used for targetting only.
// buttonType 3 (Close) sends CLOSE_MODAL.
// buttonType 6 (Pause) sends RESUME_PAUSEBUTTON.
const VALID_BUTTON_TYPES = new Set([1, 4, 5]);

export default class IfButtonHandler extends ClientGameMessageHandler<IfButton> {
    handle(message: IfButton, player: NetworkPlayer): boolean {
        if (message.com === 11927558) {
            player.write(new Logout());
            return true;
        }

        const comId = message.com;

        let com;
        try {
            com = Component.get(comId);
        } catch {
            // bad client or stale id: component not loaded
            return false;
        }

        if (!VALID_BUTTON_TYPES.has(com.buttonType)) {
            // bad client: this component's buttonType doesn't send IF_BUTTON
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
            const script = ScriptProvider.getByTriggerSpecific(ServerTriggerType.IF_BUTTON, comId, -1);
            if (script) {
                const root = Component.get(com.rootLayer);
                player.executeScript(ScriptRunner.init(script, player), root.overlay == false);
            } else if (Environment.NODE_DEBUG) {
                player.messageGame(`No trigger for [if_button,${com.comName}]`);
            }
        }

        return true;
    }
}
