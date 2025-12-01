import {EventEmitter} from 'events';
import AsyncWebSocket from './websocket';

export default class Steamdeck extends EventEmitter {
    public ready: Promise<this>;
    public state: SteamdeckInputPacket = new SteamdeckInputPacket(new DataView(new ArrayBuffer(64)));
    private oldState: SteamdeckInputPacket = new SteamdeckInputPacket(new DataView(new ArrayBuffer(64)));

    // constructor(device: HIDDevice) {
    //     super();
    //     this.ready = new Promise(async (resolve) => {
    //         if (!device.opened)
    //             await device.open();
    //         device.addEventListener('inputreport', ({ data }) => this.emit('data', new SteamdeckInputPacket(data)));
    //         const working = () => {
    //             console.log('Steamdeck Connected!')
    //             device.removeEventListener('inputreport', working);
    //         }
    //         device.addEventListener('inputreport', working);
    //         device.addEventListener('inputreport', ({ data }) => console.log(data));
    //         console.log(device.collections)
            
    //         let duration = 1000;
    //         let interval = 100;
    //         let count = 10;
    //         let gain = 255;
    //         let buffer = [
    //             0xBF,
    //             8,
    //             0,
    //             duration & 0xFF,
    //             duration >> 8,
    //             interval & 0xFF,
    //             interval >> 8,
    //             count & 0xFF,
    //             count >> 8,
    //             gain
    //         ]
    //         device.sendReport(0, new DataView(new Uint8Array(buffer).buffer));
    //         device.receiveFeatureReport(0);
    //         device.sendReport(1, new DataView(new ArrayBuffer(0)));
    //     });
    // }

    constructor(url: string) {
        super();
        this.ready = new Promise(async (resolve, reject) => {
            let ws = await new AsyncWebSocket(url).ready.catch<AsyncWebSocket>(e => e);
            if(ws instanceof Error) {
                reject(new Error("Faild to connect to hid relay", {cause: ws}));
            }
            ws.onmessage = (d) => d.data.arrayBuffer().then((ds: ArrayBuffer) => this.emit('data', new SteamdeckInputPacket(new DataView(ds))));
            
            this.on('data', (data: SteamdeckInputPacket) => {
                this.state = data;
                Object.entries(data.buttons).forEach(([button, state]) => {
                    if ((this.oldState.buttons as { [button: string]: boolean })[button] == state) return;
                    this.emit(`button:${button}:changed`, state);
                    if (state) this.emit(`button:${button}:pressed`);
                    else this.emit(`button:${button}:released`);
                });
                Object.entries(data.dpad).forEach(([button, state]) => {
                    if ((this.oldState.dpad as { [button: string]: boolean })[button] == state) return;
                    this.emit(`dpad:${button}:changed`, state);
                    if (state) this.emit(`dpad:${button}:pressed`);
                    else this.emit(`dpad:${button}:released`);
                });
                Object.entries(data.trigger).forEach(([trigger, state]) => {
                    if ((this.oldState.trigger as { [trigger: string]: number })[trigger] == state) return;
                    this.emit(`trigger:${trigger}:changed`, state);
                });
                Object.entries(data.joystick).forEach(([joystick, state]) => {
                    let oldJoystick = (this.oldState.joystick as { [joystick: string]: Joystick })[joystick];
                    if (oldJoystick.click != state.click) {
                        this.emit(`joystick:${joystick}:click:changed`, state.click);
                        if (state.click) this.emit(`joystick:${joystick}:click:pressed`);
                        else this.emit(`joystick:${joystick}:click:released`);
                    };
                    if (oldJoystick.touch != state.touch) {
                        this.emit(`joystick:${joystick}:touch:changed`, state.touch);
                        if (state.touch) this.emit(`joystick:${joystick}:touch:pressed`);
                        else this.emit(`joystick:${joystick}:touch:released`);
                    };
                    if(Math.abs(state.position.x) < 2000) state.position.x = 0;
                    if(Math.abs(state.position.y) < 2000) state.position.y = 0;
                    if (Math.abs(state.position.x - oldJoystick.position.x) > 500 || Math.abs(state.position.y - oldJoystick.position.y) > 500) {
                        this.emit(`joystick:${joystick}:position:changed`, {x: state.position.x  / 32767, y: state.position.y  / 32767});
                    }
                });
                Object.entries(data.touchpad).forEach(([touchpad, state]) => {
                    let oldTouchpad = (this.oldState.touchpad as { [touchpad: string]: Touchpad })[touchpad];
                    if (oldTouchpad.click != state.click) {
                        this.emit(`touchpad:${touchpad}:click:changed`, state.click);
                        if (state.click) this.emit(`touchpad:${touchpad}:click:pressed`);
                        else this.emit(`touchpad:${touchpad}:click:released`);
                    };
                    if (oldTouchpad.touch != state.touch) {
                        this.emit(`touchpad:${touchpad}:touch:changed`, state.touch);
                        if (state.touch) this.emit(`touchpad:${touchpad}:touch:pressed`);
                        else this.emit(`touchpad:${touchpad}:touch:released`);
                    };
                    if (oldTouchpad.pressure != state.pressure) {
                        this.emit(`touchpad:${touchpad}:pressure:changed`, state.position);
                    }
                    if (oldTouchpad.position.x != state.position.x || oldTouchpad.position.y != state.position.y) {
                        this.emit(`touchpad:${touchpad}:position:changed`, state.position);
                    }
                });
                this.oldState = data;
            });
            resolve(this);
        });
    }

    onMany(events: Array<string>, callback: Function) {
        events.forEach((ev) => this.on(ev, (...args) => callback(ev, ...args)));
    }

}

export interface Position {
    x: number;
    y: number;
};

export interface Touchpad {
    touch: boolean;
    click: boolean;
    pressure: number;
    position: Position;
};

export interface Joystick {
    touch: boolean;
    click: boolean;
    position: Position;
}

export class SteamdeckInputPacket {
    buttons: {
        l1: boolean;
        r1: boolean;
        l2: boolean;
        r2: boolean;
        l3: boolean;
        r3: boolean;
        l4: boolean;
        r4: boolean;
        l5: boolean;
        r5: boolean;
        a: boolean;
        b: boolean;
        x: boolean;
        y: boolean;
        menu: boolean;
        view: boolean;
        steam: boolean;
        quickAcces: boolean;
    };

    dpad: {
        up: boolean;
        right: boolean;
        left: boolean;
        down: boolean;
    };

    trigger: {
        left: number;
        right: number;
    };

    touchpad: {
        left: Touchpad;
        right: Touchpad;
    };

    joystick: {
        left: Joystick;
        right: Joystick;
    };

    gyroscope: [];

    constructor(data: DataView) {
        let buttonBytes: Array<number> = [];
        for (let i = 0; i < 8; i++)
            buttonBytes[i] = data.getUint8(i + 8);
        this.buttons = {
            l1: ((buttonBytes[0] >> 3) & 0x1) == 1,
            r1: ((buttonBytes[0] >> 2) & 0x1) == 1,
            l2: ((buttonBytes[0] >> 1) & 0x1) == 1,
            r2: ((buttonBytes[0] >> 0) & 0x1) == 1,
            l3: ((buttonBytes[2] >> 6) & 0x1) == 1,
            r3: ((buttonBytes[3] >> 2) & 0x1) == 1,
            l4: ((buttonBytes[5] >> 1) & 0x1) == 1,
            r4: ((buttonBytes[5] >> 2) & 0x1) == 1,
            l5: ((buttonBytes[1] >> 7) & 0x1) == 1,
            r5: ((buttonBytes[2] >> 0) & 0x1) == 1,
            a: ((buttonBytes[0] >> 7) & 0x1) == 1,
            b: ((buttonBytes[0] >> 5) & 0x1) == 1,
            x: ((buttonBytes[0] >> 6) & 0x1) == 1,
            y: ((buttonBytes[0] >> 4) & 0x1) == 1,
            menu: ((buttonBytes[1] >> 4) & 0x1) == 1,
            view: ((buttonBytes[1] >> 6) & 0x1) == 1,
            steam: ((buttonBytes[1] >> 5) & 0x1) == 1,
            quickAcces: ((buttonBytes[6] >> 2) & 0x1) == 1,
        };
        this.dpad = {
            up: ((buttonBytes[1] >> 0) & 0x1) == 1,
            right: ((buttonBytes[1] >> 1) & 0x1) == 1,
            left: ((buttonBytes[1] >> 2) & 0x1) == 1,
            down: ((buttonBytes[1] >> 3) & 0x1) == 1,
        };
        this.trigger = {
            left: data.getInt16(44, true),
            right: data.getInt16(46, true)
        };
        this.touchpad = {
            left: this.readTouchpad(data, [10, 3, 10, 1, 56, 16]),
            right: this.readTouchpad(data, [10, 4, 10, 2, 58, 20]),
        };
        this.joystick = {
            left: this.readJoystick(data, [13, 6, 10, 6, 48]),
            right: this.readJoystick(data, [13, 7, 11, 2, 52]),
        };
        this.gyroscope = [

        ];
    }

    readTouchpad(data: DataView, addresses: Array<number>): Touchpad {
        return {
            touch: ((data.getUint8(addresses[0]) >> addresses[1]) & 0x1) == 1,
            click: ((data.getUint8(addresses[2]) >> addresses[3]) & 0x1) == 1,
            pressure: data.getInt16(addresses[4], true),
            position: {
                x: data.getInt16(addresses[5], true),
                y: data.getInt16(addresses[5] + 2, true)
            }
        }
    }

    readJoystick(data: DataView, addresses: Array<number>): Joystick {
        return {
            touch: ((data.getUint8(addresses[0]) >> addresses[1]) & 0x1) == 1,
            click: ((data.getUint8(addresses[2]) >> addresses[3]) & 0x1) == 1,
            position: {
                x: data.getInt16(addresses[4], true),
                y: data.getInt16(addresses[4] + 2, true)
            }
        }
    }
}