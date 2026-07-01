import Player from '#/engine/entity/Player.js';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type EventMouseMove from '#/network/client/model/game/EventMouseMove.ts';

export default class EventMouseMoveHandler extends MessageHandler {
    handle(message: EventMouseMove, player: Player): boolean {
        player.input.mouseMove(message);
        return true;
    }
}
