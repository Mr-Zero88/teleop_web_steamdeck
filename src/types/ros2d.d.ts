import { EventEmitter } from "events";
import * as ROSLIB from 'roslib';

declare module "./ros2d.js" {
    export interface ViewerOptions {
        divID: string;
        width: number;
        height: number;
        background?: string; 
    }

    export class Viewer {
        scene: Szene;

        constructor(options: ViewerOptions);
    }

    export class Szene {

    }

    export interface OccupancyGridClientOptions {
        ros: ROSLIB.Ros;
        topic?: string;
        rootObject?: Szene;
        continuous?: boolean;
    }

    export class OccupancyGridClient extends EventEmitter {
        constructor(options: OccupancyGridClientOptions)
    }
}