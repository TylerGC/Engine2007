import Js5 from '#/engine/Js5.ts';
import NetworkPlayer from '#/engine/NetworkPlayer.ts';
import World from '#/engine/World.ts';
import Isaac from '#/io/Isaac.ts';
import Packet from '#/io/Packet.ts';
import type ClientSocket from '#/server/ClientSocket.ts';
import forge from 'node-forge';
import fs from 'fs';

const priv = forge.pki.privateKeyFromPem(
    fs.readFileSync('./data/config/private.pem', 'utf8')
);

class Login {
    decode(client: ClientSocket) {

        if (client.opcode === -1) {
            if (client.available < 1) return;
            const tmp = new Uint8Array(1);
            client.read(tmp, 0, 1);
            client.opcode = tmp[0];

            if (client.opcode === 14) {
                client.waiting = 1;
            } else if (client.opcode === 16 || client.opcode === 18) {
                client.waiting = -1;
            } else if (client.opcode === 15) {
                client.waiting = 4;
            } else {
                client.terminate();
                return;
            }
        }

        if (client.waiting === -1) {
            if (client.available < 1) return;
            const tmp = new Uint8Array(1);
            client.read(tmp, 0, 1);
            client.waiting = client.available;
        }

        if (client.available < client.waiting) return;

        const buf = new Packet(new Uint8Array(client.waiting));
        client.read(buf.data, 0, client.waiting);
        buf.pos = 0;

        const opcode = client.opcode;
        client.opcode = -1;
        client.waiting = 0;

        if (opcode === 14) {
            const _userHashNumber = buf.g1();
            const reply = Packet.alloc(9);
            reply.p1(0);
            reply.p4(Math.floor(Math.random() * 0x00ffffff));
            reply.p4(Math.floor(Math.random() * 0xffffffff));
            client.write(reply);
        } else if (opcode === 15) {
            const _revision = buf.g4();

            // todo: out of date response

            Js5.addClient(client);
        } else if (opcode === 16 || opcode === 18) {

            const _rev = buf.g4();
            const _lowMemory = buf.g1();

            buf.pos += 24; // todo: UID

            const _settings = buf.gjstr();
            const _affid = buf.g4();

            for (let i = 0; i < 27; i++) buf.g4();

            buf.rsadec(priv);

            if (buf.g1() !== 10) {
                client.write(Uint8Array.from([6]));
                client.close();
                return;
            }

            const seed: number[] = [];
            for (let i = 0; i < 4; i++) seed[i] = buf.g4();

            client.decryptor = new Isaac(seed);
            for (let i = 0; i < 4; i++) seed[i] += 50;
            client.encryptor = new Isaac(seed);

            const _userhash = buf.g8();
            const _password = buf.gjstr();

            const player = new NetworkPlayer(client);
            World.addPlayer(player, opcode === 18);
        }
    }
}

export default new Login();
