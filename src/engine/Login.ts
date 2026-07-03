import Js5 from '#/engine/Js5.ts';
import { NetworkPlayer } from '#/engine/entity/NetworkPlayer.ts';
import World from '#/engine/World.ts';
import Isaac from '#/io/Isaac.ts';
import Packet from '#/io/Packet.ts';
import type ClientSocket from '#/server/ClientSocket.ts';
import forge from 'node-forge';
import fs from 'fs';
import { fromBase37 } from '#/util/JString.ts';

const priv = forge.pki.privateKeyFromPem(
    fs.readFileSync('./data/config/private.pem', 'utf8')
);

class Login {
    revision = 500;

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
            client.waiting = tmp[0];
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
            client.send(reply.data.subarray(0, reply.pos));
        } else if (opcode === 15) {
            const revision = buf.g4();

            if (revision !== this.revision) {
                client.close();
                return;
            }

            Js5.addClient(client);
        } else if (opcode === 16 || opcode === 18) {
            const revision = buf.g4();

            if (revision !== this.revision) {
                client.close();
                return;
            }

            const lowMemory = buf.g1();

            buf.pos += 24; // uid192

            const settings = buf.gjstr();
            if (settings === null) {
                client.close();
                return;
            }

            if (buf.pos + 4 > buf.length) {
                client.close();
                return;
            }
            const affiliate = buf.g4();

            const crcCount = 27;
            if (buf.pos + crcCount * 4 > buf.length) {
                client.close();
                return;
            }
            for (let i = 0; i < crcCount; i++) buf.g4();

            try {
                buf.rsadec(priv);
            } catch (err) {
                console.warn('Login RSA decode failed:', err);
                client.close();
                return;
            }

            if (buf.pos >= buf.length || buf.g1() !== 10) {
                const reply = Packet.alloc(1);
                reply.p1(6);
                client.send(reply.data.subarray(0, reply.pos));
                client.close();
                return;
            }

            const seed: number[] = [];
            for (let i = 0; i < 4; i++) seed[i] = buf.g4();

            client.decryptor = new Isaac(seed);
            for (let i = 0; i < 4; i++) seed[i] += 50;
            client.encryptor = new Isaac(seed);

            const userhash = buf.g8();
            const password = buf.gjstr();

        const player = new NetworkPlayer(fromBase37(userhash), userhash, userhash, client);
        World.addPlayer(player, opcode === 18);
        }
    }
}

export default new Login();
