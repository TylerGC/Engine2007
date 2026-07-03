import Js5ClientMessageHandler from '#/network/game/client/Js5ClientMessageHandler.ts';
import type XorChange from '../../model/js5/XorChange.ts';

export default class XorChangeHandler extends Js5ClientMessageHandler<XorChange> {
    handle() {
        // todo
        return true;
    }
}
