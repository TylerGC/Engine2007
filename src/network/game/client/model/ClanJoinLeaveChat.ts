import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.js';
import ClientGameMessage from '#/network/game/client/ClientGameMessage.js';

export default class ClanJoinLeaveChat extends ClientGameMessage {
    category = ClientGameProtCategory.USER_EVENT;

    constructor(readonly clanname: bigint) {
        super();
    }
}
