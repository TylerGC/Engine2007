import type Player from '#/engine/Player.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type EventMouseClick from '#/network/client/model/game/EventMouseClick.ts';

export default class EventMouseClickHandler extends MessageHandler {
    handle(message: EventMouseClick, player: Player): boolean {
        player.input.mouseClick(message);
        return true;
    }
}
