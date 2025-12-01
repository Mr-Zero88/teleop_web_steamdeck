export default class AsyncWebSocket extends WebSocket {
    public ready: Promise<this>;

    constructor(url: string | URL, protocols?: string | string[]) {
        super(url, protocols);
        this.ready = new Promise((resolve, reject) => {
            this.onopen = () => resolve(this);
            this.onclose = (e) => reject(new Error(`WebSocketClosed`, {cause: e}));
        });
    }
}