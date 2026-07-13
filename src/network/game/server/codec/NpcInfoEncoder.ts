import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type NpcInfo from '#/network/game/server/model/NpcInfo.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'

export default class NpcInfoEncoder extends ServerGameMessageEncoder<NpcInfo> {
    prot = ServerGameProt.NPC_INFO;

    encode(buf: Packet, message: NpcInfo) {
        buf.pdata(message.bytes, 0, message.bytes.length);
    }

    test(_: NpcInfo): number {
        return 500; // todo
    }
}
