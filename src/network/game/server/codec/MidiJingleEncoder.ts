import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type MidiJingle from '#/network/game/server/model/MidiJingle.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'

export default class MidiJingleEncoder extends ServerGameMessageEncoder<MidiJingle> {
    prot = ServerGameProt.MIDI_JINGLE;

    encode(buf: Packet, message: MidiJingle) {
        buf.p2_alt3(message.id)

        //the following 3 bytes are read but not used so empty-fill the buffer (should be g3_alt2)
        buf.p1(0)
        buf.p1(0)
        buf.p1(0)
    }
}
