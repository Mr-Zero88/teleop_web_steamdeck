import * as ROSLIB from "roslib";

import * as nav_msgs from '@ros2/nav_msgs';

export interface OccupancyGridOptions {
    ros: ROSLIB.Ros;
    topic?: string;
}

export class OccupancyGrid extends ROSLIB.Topic<nav_msgs.IOccupancyGrid> {
    constructor({ ros, topic }: OccupancyGridOptions) {
        super({ ros, name: topic ?? "/map", messageType: "nav_msgs/msg/OccupancyGrid" });
        this.subscribe(this.onData);
    }

    onData(data: nav_msgs.IOccupancyGrid) {
        let grid = new nav_msgs.OccupancyGrid(data);
        console.log("Info", grid.info);
        console.log("Data", grid.data);
    }
}
