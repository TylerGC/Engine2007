import ClientGameProt from '#/network/game/client/prot/ClientGameProt.ts';
import ClientGameMessageDecoder from '#/network/game/client/ClientGameMessageDecoder.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.ts';
import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';

import ClientCheatDecoder from '#/network/game/client/codec/ClientCheatDecoder.ts';
import MoveClickDecoder from '#/network/game/client/codec/MoveClickDecoder.ts';
import ClientCheatHandler from '#/network/game/client/handler/ClientCheatHandler.ts';
import MoveClickHandler from '#/network/game/client/handler/MoveClickHandler.ts';
import MessagePublicDecoder from '#/network/game/client/codec/MessagePublicDecoder.ts';
import MessagePublicHandler from '#/network/game/client/handler/MessagePublicHandler.ts';
import EventMouseClickDecoder from '#/network/game/client/codec/EventMouseClickDecoder.ts';
import EventMouseClickHandler from '#/network/game/client/handler/EventMouseClickHandler.ts';
import EventMouseMoveDecoder from '#/network/game/client/codec/EventMouseMoveDecoder.ts';
import EventMouseMoveHandler from '#/network/game/client/handler/EventMouseMoveHandler.ts';
import EventAppletFocusDecoder from '#/network/game/client/codec/EventAppletFocusDecoder.ts';
import EventAppletFocusHandler from '#/network/game/client/handler/EventAppletFocusHandler.ts';
import EventCameraPositionDecoder from '#/network/game/client/codec/EventCameraPositionDecoder.ts';
import EventCameraPositionHandler from '#/network/game/client/handler/EventCameraPositionHandler.ts';
import OpObjDecoder from '#/network/game/client/codec/OpObjDecoder.ts';
import OpObjHandler from '#/network/game/client/handler/OpObjHandler.ts';
import OpObjEDecoder from '#/network/game/client/codec/OpObjEDecoder.ts';
import OpObjEHandler from '#/network/game/client/handler/OpObjEHandler.ts';
import OpNpcDecoder from '#/network/game/client/codec/OpNpcDecoder.ts';
import OpNpcHandler from '#/network/game/client/handler/OpNpcHandler.ts';
import OpNpcEDecoder from '#/network/game/client/codec/OpNpcEDecoder.ts';
import OpNpcEHandler from '#/network/game/client/handler/OpNpcEHandler.ts';
import OpLocDecoder from '#/network/game/client/codec/OpLocDecoder.ts';
import OpLocHandler from '#/network/game/client/handler/OpLocHandler.ts';
import OpLocEDecoder from '#/network/game/client/codec/OpLocEDecoder.ts';
import OpLocEHandler from '#/network/game/client/handler/OpLocEHandler.ts';
import OpPlayerDecoder from '#/network/game/client/codec/OpPlayerDecoder.ts';
import OpPlayerHandler from '#/network/game/client/handler/OpPlayerHandler.ts';
import IfButtonDecoder from '#/network/game/client/codec/IfButtonDecoder.ts';
import IfButtonHandler from '#/network/game/client/handler/IfButtonHandler.ts';
import IfButtonXDecoder from '#/network/game/client/codec/IfButtonXDecoder.ts';
import IfButtonXHandler from '#/network/game/client/handler/IfButtonXHandler.ts';
import ClanJoinChatLeaveChatDecoder from '#/network/game/client/codec/ClanJoinChatLeaveChatDecoder.ts';
import ClanJoinChatLeaveChatHandler from '#/network/game/client/handler/ClanJoinChatLeaveChatHandler.ts';


class ClientGameProtRepository {
    decoders: Map<number, ClientGameMessageDecoder<ClientGameMessage>> = new Map();
    handlers: Map<number, ClientGameMessageHandler<ClientGameMessage>> = new Map();

    protected bind(decoder: ClientGameMessageDecoder<ClientGameMessage>, handler?: ClientGameMessageHandler<ClientGameMessage>) {
        if (this.decoders.has(decoder.prot.id)) {
            throw new Error(`[ClientProtRepository] Already defines a ${decoder.prot.id}.`);
        }

        this.decoders.set(decoder.prot.id, decoder);

        if (handler) {
            this.handlers.set(decoder.prot.id, handler);
        }
    }

    getDecoder(prot: ClientGameProt) {
        return this.decoders.get(prot.id);
    }

    getHandler(prot: ClientGameProt) {
        return this.handlers.get(prot.id);
    }

    constructor() {
        this.bind(new MessagePublicDecoder(), new MessagePublicHandler());
        this.bind(new ClientCheatDecoder(), new ClientCheatHandler());

        this.bind(new MoveClickDecoder(ClientGameProt.MOVE_GAMECLICK), new MoveClickHandler());
        this.bind(new MoveClickDecoder(ClientGameProt.MOVE_OPCLICK), new MoveClickHandler());
        this.bind(new MoveClickDecoder(ClientGameProt.MOVE_MINIMAPCLICK), new MoveClickHandler());

        this.bind(new EventMouseClickDecoder(), new EventMouseClickHandler());
        this.bind(new EventMouseMoveDecoder(), new EventMouseMoveHandler());
        this.bind(new EventAppletFocusDecoder(), new EventAppletFocusHandler());
        this.bind(new EventCameraPositionDecoder(), new EventCameraPositionHandler());

        this.bind(new OpObjDecoder(ClientGameProt.OPOBJ1, 1), new OpObjHandler());
        this.bind(new OpObjDecoder(ClientGameProt.OPOBJ2, 2), new OpObjHandler());
        this.bind(new OpObjDecoder(ClientGameProt.OPOBJ3, 3), new OpObjHandler());
        this.bind(new OpObjDecoder(ClientGameProt.OPOBJ4, 4), new OpObjHandler());
        this.bind(new OpObjDecoder(ClientGameProt.OPOBJ5, 5), new OpObjHandler());
        this.bind(new OpObjEDecoder, new OpObjEHandler());

        this.bind(new OpNpcDecoder(ClientGameProt.OPNPC1, 1), new OpNpcHandler());
        this.bind(new OpNpcDecoder(ClientGameProt.OPNPC2, 2), new OpNpcHandler());
        this.bind(new OpNpcDecoder(ClientGameProt.OPNPC3, 3), new OpNpcHandler());
        this.bind(new OpNpcDecoder(ClientGameProt.OPNPC4, 4), new OpNpcHandler());
        this.bind(new OpNpcDecoder(ClientGameProt.OPNPC5, 5), new OpNpcHandler());
        this.bind(new OpNpcEDecoder, new OpNpcEHandler());

        this.bind(new OpLocDecoder(ClientGameProt.OPLOC1, 1), new OpLocHandler());
        this.bind(new OpLocDecoder(ClientGameProt.OPLOC2, 2), new OpLocHandler());
        this.bind(new OpLocDecoder(ClientGameProt.OPLOC3, 3), new OpLocHandler());
        this.bind(new OpLocDecoder(ClientGameProt.OPLOC4, 4), new OpLocHandler());
        this.bind(new OpLocDecoder(ClientGameProt.OPLOC5, 5), new OpLocHandler());
        this.bind(new OpLocDecoder(ClientGameProt.OPLOC6, 6), new OpLocHandler());
        this.bind(new OpLocEDecoder, new OpLocEHandler());

        this.bind(new OpPlayerDecoder(ClientGameProt.OPPLAYER1, 1), new OpPlayerHandler());
        this.bind(new OpPlayerDecoder(ClientGameProt.OPPLAYER2, 2), new OpPlayerHandler());
        this.bind(new OpPlayerDecoder(ClientGameProt.OPPLAYER3, 3), new OpPlayerHandler());
        this.bind(new OpPlayerDecoder(ClientGameProt.OPPLAYER4, 4), new OpPlayerHandler());
        this.bind(new OpPlayerDecoder(ClientGameProt.OPPLAYER5, 5), new OpPlayerHandler());
        this.bind(new OpPlayerDecoder(ClientGameProt.OPPLAYER6, 6), new OpPlayerHandler());
        this.bind(new OpPlayerDecoder(ClientGameProt.OPPLAYER7, 7), new OpPlayerHandler());
        this.bind(new OpPlayerDecoder(ClientGameProt.OPPLAYER8, 8), new OpPlayerHandler());

        this.bind(new IfButtonDecoder, new IfButtonHandler());
        this.bind(new IfButtonXDecoder(ClientGameProt.IF_BUTTON1, 1), new IfButtonXHandler());
        this.bind(new IfButtonXDecoder(ClientGameProt.IF_BUTTON2, 2), new IfButtonXHandler());
        this.bind(new IfButtonXDecoder(ClientGameProt.IF_BUTTON3, 3), new IfButtonXHandler());
        this.bind(new IfButtonXDecoder(ClientGameProt.IF_BUTTON4, 4), new IfButtonXHandler());
        this.bind(new IfButtonXDecoder(ClientGameProt.IF_BUTTON5, 5), new IfButtonXHandler());
        this.bind(new IfButtonXDecoder(ClientGameProt.IF_BUTTON6, 6), new IfButtonXHandler());
        this.bind(new IfButtonXDecoder(ClientGameProt.IF_BUTTON7, 7), new IfButtonXHandler());
        this.bind(new IfButtonXDecoder(ClientGameProt.IF_BUTTON8, 8), new IfButtonXHandler());
        this.bind(new IfButtonXDecoder(ClientGameProt.IF_BUTTON9, 9), new IfButtonXHandler());
        this.bind(new IfButtonXDecoder(ClientGameProt.IF_BUTTON10, 10), new IfButtonXHandler());

        this.bind(new ClanJoinChatLeaveChatDecoder(), new ClanJoinChatLeaveChatHandler());
    }
}

export default new ClientGameProtRepository();