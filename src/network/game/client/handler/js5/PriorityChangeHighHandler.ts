import Js5ClientMessageHandler from '#/network/game/client/Js5ClientMessageHandler.ts';
import PriorityChangeHigh from '../../model/js5/PriorityChangeHigh.ts';

export default class PriorityChangeHighHandler extends Js5ClientMessageHandler<PriorityChangeHigh> {
    handle() {
        // todo
        return true;
    }
}
