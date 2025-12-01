import * as ROSLIB from "roslib";

export default class AsyncRosBridge extends ROSLIB.Ros {
    public ready: Promise<this>;
    public rosout: ROSLIB.Topic<Log>;
    public parameterEvents: ROSLIB.Topic<ParameterEvent>;
    public clientCount: ROSLIB.Topic<number>;
    public connectedClients: ROSLIB.Topic<ConnectedClients>;

    constructor(url: string) {
        super({url});
        this.ready = new Promise((resolve, reject) => {
            this.on("connection", () => setTimeout(() => resolve(this), 100));
            this.on("error", () => reject(new RosBridgeError()));
            this.on("close", () => reject(new RosBridgeClosed()));
            this.connect(url);
        });
        this.rosout = new ROSLIB.Topic({
            ros: this,
            name: "/rosout",
            messageType: "rcl_interfaces/msg/Log"
        });
        this.parameterEvents = new ROSLIB.Topic({
            ros: this,
            name: "/parameter_events",
            messageType: "rcl_interfaces/msg/ParameterEvent"
        });
        this.clientCount = new ROSLIB.Topic({
            ros: this,
            name: "/client_count",
            messageType: "std_msgs/msg/Int32"
        });
        this.connectedClients = new ROSLIB.Topic({
            ros: this,
            name: "/connected_clients",
            messageType: "rosbridge_msgs/msg/ConnectedClients"
        });
    }
}

class RosBridgeError extends Error {
    constructor() {
        super("Faild to connect to Ros Bridge");
        this.name = "RosBridgeError";
    }
}

class RosBridgeClosed extends Error {
    constructor() {
        super("The ros bridge closed");
        this.name = "RosBridgeClosed";
    }
}

interface Log {

}

interface ParameterEvent {

}

type ConnectedClients = ConnectedClient[];

interface ConnectedClient {
    ip_address: string;
    connection_time: ROSLIB.std_msgs.time;
}