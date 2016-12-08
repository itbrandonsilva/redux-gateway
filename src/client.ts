import { StateServer, Input } from './server';
import * as Redux from 'redux';
import * as sio from 'socket.io-client';

export class StateClient {
    private clientId;
    private socket;
    private subscription;

    /**
     * @param initCb Callback to receive the initial state from the `StateServer`.
     * @param actionsCb Callback to receive actions flushed by the `StateServer`.
     * @param host `StateServer` host address.
     * @param port `StateServer` port.
     * 
     */
    constructor(initCb, actionsCb, host='127.0.0.1', port=7541) {
        this.socket = sio(host + ':' + port);

        this.socket.on('init', data => {
            this.clientId = data.clientId;
            initCb(null, data.state, data.clientId);
        });

        this.socket.on('actions', data => {
            actionsCb(data.actions);
        });
    }

    /**
     * Emits an an input in the form of a `name` and a `value` to the `StateServer`.
     * @param name Name of the input.
     * @param value Value of the Input.
     * 
     */
    sendInput(name, value) {
        if ( ! this.socket ) throw new Error('sendInput(): Must be connected to server before inputs can be sent.')
        this.socket.emit('input', {name, value});
    }
}