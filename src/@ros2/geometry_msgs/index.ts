import * as ROSLIB from "roslib";
import { Header, type IHeader } from "@ros2/std_msgs";

export type IPose = ROSLIB.IPose;

export class Pose {
    position: Vector3;
    orientation: Quaternion;

    constructor(data: IPose) {
        this.position = data.position;
        this.orientation = data.orientation;
    }
}

export type IVector3 = ROSLIB.Vector3;

export class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(data: IVector3) {
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
    }
}

export type IQuaternion = ROSLIB.IQuaternion;

export class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;

    constructor(data: IQuaternion) {
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
        this.w = data.w;
    }
}

export interface ITwist {
    linear: IVector3;
    angular: IVector3;
}

export class Twist {
    linear: Vector3;
    angular: Vector3;

    constructor(data: ITwist) {
        this.linear = data.linear;
        this.angular = data.angular;
    }
}

export interface ITwistStamped {
    header: IHeader;
    twist: ITwist;
}

export class TwistStamped {
    header: Header;
    twist: Twist;

    constructor(data: ITwistStamped) {
        this.header = new Header(data.header);
        this.twist = data.twist;
    }
}