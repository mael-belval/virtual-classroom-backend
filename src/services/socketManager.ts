import { Server, ServerOptions } from 'socket.io';

export class SocketManager {
    private static instance: Server;

    public static init(httpServer: any, options?: Partial<ServerOptions>): Server {
        if (!SocketManager.instance) {
            SocketManager.instance = new Server(httpServer, options);
        }
        return SocketManager.instance;
    }

    public static getIO(): Server {
        if (!SocketManager.instance) {
            throw new Error("Socket.IO instance not initialized. Call init first.");
        }
        return SocketManager.instance;
    }
}
