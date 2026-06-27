import type Player from '#/engine/Player.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type EventAppletFocus from '#/network/client/model/game/EventAppletFocus.ts';

export default class EventAppletFocusHandler extends MessageHandler {
    handle(message: EventAppletFocus, player: Player): boolean {
        player.input.appletFocus(message);
        return true;
    }
}
