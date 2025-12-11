import { Header, type IHeader, type ITime } from "@ros2/std_msgs";
import type { IPose } from "@ros2/geometry_msgs";
import { Pose } from "roslib";

export interface IOccupancyGrid {
    header: IHeader;
    info: IMapMetaData;
    data: Array<number>[];
}

export class OccupancyGrid {
    header: Header;
    info: MapMetaData;
    data: Array<number>[];

    constructor(data: IOccupancyGrid) {
        this.header = new Header(data.header);
        this.info = new MapMetaData(data.info);
        this.data = data.data;
    }
}

export interface IMapMetaData {
    map_load_time: ITime;
    resolution: number;
    width: number;
    height: number;
    origin: IPose;
}

export class MapMetaData {
    mapLoadTime: ITime;
    resolution: number;
    width: number;
    height: number;
    origin: Pose;

    constructor(data: IMapMetaData) {
        this.mapLoadTime = data.map_load_time;
        this.resolution = data.resolution;
        this.width = data.width;
        this.height = data.height;
        this.origin = new Pose(data.origin);
    }
}