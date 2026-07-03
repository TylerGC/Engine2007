import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type SynthSound from '#/network/game/server/model/SynthSound.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'

export default class SynthSoundEncoder extends ServerGameMessageEncoder<SynthSound> {
    prot = ServerGameProt.SYNTH_SOUND;

    encode(buf: Packet, message: SynthSound) {
        buf.p2(message.id);
        buf.p1(message.loops ? 1 : 0);
        buf.p2(message.delay)
    }
}
