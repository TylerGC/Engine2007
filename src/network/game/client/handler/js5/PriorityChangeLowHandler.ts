import Js5ClientMessageHandler from '#/network/game/client/Js5ClientMessageHandler.ts';
import PriorityChangeLow from '../../model/js5/PriorityChangeLow.ts';

export default class PriorityChangeLowHandler extends Js5ClientMessageHandler<PriorityChangeLow> {
    handle() {
        // todo
        return true;
    }
}
