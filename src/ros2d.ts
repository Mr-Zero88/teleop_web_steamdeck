import * as ROSLIB from "roslib";

import * as nav_msgs from './nav_msgs';

export interface OccupancyGridOptions {
    ros: ROSLIB.Ros;
    topic?: string;
}

export class OccupancyGrid extends ROSLIB.Topic<nav_msgs.OccupancyGrid> {
    constructor({ ros, topic }: OccupancyGridOptions) {
        super({ ros, name: topic ?? "/map", messageType: "nav_msgs/msg/OccupancyGrid" });
        this.subscribe(this.onData);
    }

    onData(data: nav_msgs.OccupancyGrid) {
        console.log("Info", data.info);
        console.log("Data", data.data);
    }
}
