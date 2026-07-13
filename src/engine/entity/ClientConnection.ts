import type Player from '#/engine/entity/Player.js';
import type { NetworkPlayer } from '#/engine/entity/NetworkPlayer.js';
import NullClientSocket from '#/server/NullSocket.js';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.js';
import ServerGameProtRepository from '#/network/game/server/prot/ServerGameProtRepository.js';
import ServerGameMessage from '#/network/game/server/ServerGameMessage.js';

export function isClientConnected(player: Player): player is NetworkPlayer {
    return player.isNetworked && !((player as NetworkPlayer).client instanceof NullClientSocket);
}

export function isBufferFull(player: Player): boolean {
    if (!isClientConnected(player)) {
        return false;
    }

    let total = 0;

    for (const message of player.buffer) {
        const encoder: ServerGameMessageEncoder<ServerGameMessage> | undefined = ServerGameProtRepository.getEncoder(message);
        if (!encoder) {
            return true;
        }

        const prot = encoder.prot;
        total += 1 + (prot.length === -1 ? 1 : prot.length === -2 ? 2 : 0) + encoder.test(message);
    }

    return total >= 5000;
}
