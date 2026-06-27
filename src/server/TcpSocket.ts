import net from 'net';
import ClientSocket from '#/server/ClientSocket.ts';
import Packet from '#/io/Packet.ts';

export default class TcpSocket extends ClientSocket {
    private socket: net.Socket;

    constructor(socket: net.Socket) {
        super();
        this.socket = socket;
        this.remoteAddress = socket.remoteAddress ?? 'unknown';
    }


    buffer(data: Buffer): void {
        if (data.length + this.inBufferPos > this.inBuffer.length) {
            this.close();
            return;
        }
        this.inBuffer.set(data, this.inBufferPos);
        this.inBufferPos += data.length;
    }
    get available(): number {
        return this.inBufferPos;
    }

    read(dest: Uint8Array, offset: number, length: number): void {
        if (this.inBufferPos < length) {
            return;
        }

        dest.set(this.inBuffer.subarray(0, length), offset);
        this.inBufferPos -= length;
        this.inBuffer.set(this.inBuffer.subarray(length), 0);
    }

    write(src: Uint8Array | Packet): void {
        if (!this.socket.writable) return;
        if (src instanceof Uint8Array) {
            this.socket.write(src);
        } else {
            this.socket.write(src.data.subarray(0, src.pos));
        }
    }

    close() {
        this.state = -1;
        this.socket.end();
    }

    terminate() {
        this.state = -1;
        this.socket.destroy();
    }
}
