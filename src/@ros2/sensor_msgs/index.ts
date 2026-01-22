

/*
std_msgs/msg/Header header
uint32 height
uint32 width
string encoding
uint8 is_bigendian
uint32 step
uint8[] data
*/

import type { IHeader } from "@ros2/std_msgs";

export interface IImage {
    header: IHeader;
    height: number;
    width: number;
    encoding: string;
    is_bigendian: number;
    step: number;
    data: Uint8Array;
}
