import * as ROSLIB from "roslib";
import type { Header } from "./turtleBot";
import type { Pose } from "./geometry_msgs";

export interface OccupancyGrid {
    header: Header;
    info: MapMetaData;
    data: Array<number>[];
}

interface MapMetaData {
    map_load_time: Time;
    resolution: number;
    width: number;
    height: number;
    origin: Pose;
}

type Time = ROSLIB.std_msgs.time;