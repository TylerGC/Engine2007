import ClientGameMessage from '#/network/game/client/ClientGameMessage.ts';
import ClientGameProtCategory from '#/network/game/client/prot/ClientGameProtCategory.ts';

export default class PrefetchRequest extends ClientGameMessage {
    category = ClientGameProtCategory.CLIENT_EVENT;
    archive: number;
    group: number;

    constructor(archive: number, group: number) {
        super();

        this.archive = archive;
        this.group = group;
    }
}
