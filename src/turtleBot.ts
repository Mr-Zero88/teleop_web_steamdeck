import * as ROSLIB from "roslib";
import AsyncRosBridge from "./rosBridge";
import type { ITwistStamped } from "@ros2/geometry_msgs";
import type { IBatteryState } from "@ros2/std_msgs";

export default class TurtleBot extends AsyncRosBridge {
    public cmdVel: ROSLIB.Topic<ITwistStamped>;
    public batteryState: ROSLIB.Topic<IBatteryState>;

    constructor(url: string) {
        super(url);
        this.cmdVel = new ROSLIB.Topic({
            ros: this,
            name: "/cmd_vel",
            messageType: "geometry_msgs/TwistStamped",
        });
        this.batteryState = new ROSLIB.Topic({
            ros: this,
            name: "/battery_state",
            messageType: "sensor_msgs/BatteryState",
        });
    }
}