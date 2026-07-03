import Js5 from '#/engine/Js5.ts';
import Js5ClientMessageHandler from '#/network/game/client/Js5ClientMessageHandler.ts';
import type UrgentRequest from '../../model/js5/UrgentRequest.ts';
import ClientSocket from '#/server/ClientSocket.ts';

export default class UrgentRequestHandler extends Js5ClientMessageHandler<UrgentRequest> {
    handle(message: UrgentRequest, client: ClientSocket): boolean {
        if (client.urgentLimit >= 20) {
            return true;
        }

        const { archive, group } = message;

        Js5.urgent.push({ client, archive, group });
        client.urgentLimit++;
        return true;
    }
}
