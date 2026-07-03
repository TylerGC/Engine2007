import { PlayerInfoProt } from '#/network/rsbuf/prot.ts';

import Player from '#/engine/entity/Player.js';
import Packet from '#/io/Packet.js';
import MessagePublic from '#/network/game/client/model/MessagePublic.ts';
import WordPack from '#/wordfilter2/WordPack.ts';
import ClientGameMessageHandler from '#/network/game/client/ClientGameMessageHandler.js';

export default class MessagePublicHandler extends ClientGameMessageHandler<MessagePublic> {
    handle(message: MessagePublic, player: Player): boolean {
        const { colour, effect, input } = message;

        if (player.socialProtect || colour < 0 || colour > 11 || effect < 0 || effect > 2 || input.length > 100) {
            return false;
        }

        if (player.muted_until !== null && player.muted_until > new Date()) {
            // todo: do we still log their attempt to chat?
            return false;
        }

        const buf = new Packet(input);
        const unpack: string = WordPack.unpack(buf);
        player.chatColour = colour;
        player.chatEffect = effect;
        player.chatRights = Math.min(player.staffModLevel, 2);
        player.logMessage = unpack;

        const out: Packet = Packet.alloc(1024);
        WordPack.pack(out, unpack); // todo: Filter out no-no words? No more client-side wordenc filter. 
        player.chatMessage = new Uint8Array(out.pos);
        out.pos = 0;
        out.gdata(player.chatMessage, 0, player.chatMessage.length);
        out.release();
        player.masks |= PlayerInfoProt.CHAT;

        player.socialProtect = true;
        return true;
    }
}
