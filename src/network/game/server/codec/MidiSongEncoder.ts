import type Packet from '#/io/Packet.ts';
import ServerGameMessageEncoder from '#/network/game/server/ServerGameMessageEncoder.ts'
import type MidiSong from '#/network/game/server/model/MidiSong.ts';
import ServerGameProt from '#/network/game/server/prot/ServerGameProt.ts'

export default class MidiSongEncoder extends ServerGameMessageEncoder<MidiSong> {
    prot = ServerGameProt.MIDI_SONG;

    encode(buf: Packet, message: MidiSong) {
        buf.p2_alt1(message.id)
    }
}
