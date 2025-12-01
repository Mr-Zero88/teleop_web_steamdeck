import * as ROSLIB from "roslib";
import AsyncRosBridge from "./rosBridge";

export default class TurtleBot extends AsyncRosBridge {
    public cmdVel: ROSLIB.Topic<TwistStamped>;
    public batteryState: ROSLIB.Topic<BatteryState>;

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

interface BatteryState {
    percentage: number;
}

interface TwistStamped {
    header: Header;
    twist: Twist;
}

export interface Header extends ROSLIB.std_msgs.ROS1Header {
    
}

interface Twist {
    linear: ROSLIB.geometry_msgs.Vector3;
    angular: ROSLIB.geometry_msgs.Vector3;
}