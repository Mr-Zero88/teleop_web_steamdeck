import Steamdeck, { type Position } from "./steamdeck";
import TurtleBot from "./turtleBot";
import * as ROSLIB from "roslib";
// import AsyncWebSocket from "./websocket";

/// <reference path='types/ros2d.d.ts'/>
import * as ROS2D from './ros2d.js';

export default async function setup(url: string) {
    let steamdeck = await new Steamdeck('ws://localhost:7000').ready.catch(e => e);
    if(steamdeck instanceof Error) throw new Error("Faild to create steamdeck", {cause: steamdeck});
    let turtleBot = await new TurtleBot(url).ready.catch((e: Error) => e);
    if(turtleBot instanceof Error) throw new Error("Faild to connect to ros2 bridge", {cause: turtleBot});
    var viewer = new ROS2D.Viewer({
        divID : 'map',
        width : 600,
        height : 500
    });
     var gridClient = new ROS2D.OccupancyGridClient({
      ros : turtleBot,
      rootObject : viewer.scene,
      topic: "/map",
      continuous: true
    });
    // Scale the canvas to fit to the map
    gridClient.on('change', function() {
      viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
      viewer.shift(gridClient.currentGrid.pose.position.x, gridClient.currentGrid.pose.position.y);
    });
    // let websocket = await new AsyncWebSocket(url).ready.catch(e => e);
    // if(websocket instanceof Error) throw new Error("Faild to connect to ros2 relay", {cause: websocket});
    let linear_speed = 0.1;
    let linear_velocity = 0;
    let angular_speed = -1;
    let angular_velocity = 0;
    let changed = true;
    steamdeck.on(`joystick:left:position:changed`, (position: Position) => {
        angular_velocity = position.x * angular_speed;
        linear_velocity = position.y * linear_speed;
        changed = true;
    });
    // steamdeck.on(`joystick:right:position:changed`, (position: Position) => {
    //     angular_velocity = position.x * angular_speed;
    //     changed = true;
    // });
    function createTime(date: Date): ROSLIB.std_msgs.time {
        let time = date.getTime();
        let secs = Math.floor(time / 1000);
        let nsecs = time - secs * 1000; 
        return {
            secs,
            nsecs
        }
    }
    setInterval(() => {
        if(changed) {
            changed = false;
            turtleBot.cmdVel.publish({
                header: {
                    stamp: createTime(new Date())
                },
                twist: {
                    angular: {
                        x: 0,
                        y: 0,
                        z: angular_velocity
                    },
                    linear: {
                        x: linear_velocity,
                        y: 0,
                        z: 0
                    }
                }
            })
            //websocket.send(JSON.stringify({linear_velocity, angular_velocity}));
        }
    }, 100);
    return turtleBot;
}