import type Player from '#/engine/Player.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type EventCameraPosition from '#/network/client/model/game/EventCameraPosition.ts';

export default class EventCameraPositionHandler extends MessageHandler {
    handle(message: EventCameraPosition, player: Player): boolean {
        player.input.cameraPosition(message);
        return true;
    }
}
