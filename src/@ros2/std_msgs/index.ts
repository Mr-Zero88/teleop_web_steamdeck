import * as ROSLIB from 'roslib';

export interface IBatteryState {
    percentage: number;
}

export type IHeader = ROSLIB.std_msgs.ROS1Header;

export class Header {
    seq?: number;
    stamp?: Time;
    frameId?: string;

    constructor(data: IHeader) {
        this.seq = data.seq;
        this.stamp = data.stamp && new Time(data.stamp);
        this.frameId = data.frame_id;
    }
}

export type ITime = ROSLIB.std_msgs.time;

export class Time {
    secs: number;
    nsecs: number;

    constructor(data: ITime) {
        this.secs = data.secs;
        this.nsecs = data.nsecs;
    }
}