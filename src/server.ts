import { StateClient } from './client';
import * as sio from 'socket.io';

export type ActionTransformer = (clientId: string, action: any) => any;
export type EventHandler = (clientId: string, action: any) => boolean;
export type GetStateWrapper = () => any;
export type InputHandler = (input: Input) => void;
export interface Input {
    clientId: string;
    name: string;
    value: any;
};

export class StateServer {
    private actions = [];
    private clients = {};
    private idPool = 0;
    private events = [];
    private _transformer: ActionTransformer;
    private _eventHandler: EventHandler;

    /**
     * @param getState Function that retrieves the current state
     * @param inputHandler Function that receives inputs from remote clients
     * @param port Port number to listen on
     * 
     */
    constructor(private getState: GetStateWrapper, private inputHandler, port=7541) {
        let io = sio(port);

        io.on('connection', (socket) => {
            let clientId = (++this.idPool).toString();
            let state = this.getState();

            socket.emit('init', {state, clientId});

            this.clients[clientId] = socket;
            this._pushEvent({type: 'CLIENT_CONNECT', state, clientId});

            socket.on('input', (input) => {
                this.inputHandler({clientId, name: input.name, value: input.value});
            });

            socket.on('disconnect', () => {
                delete this.clients[clientId];
                this._pushEvent({type: 'CLIENT_DISCONNECT', clientId});
            });
        });
    }

    /**
     * @param transformer Function that receives all actions that have been caught by `reduxMiddleware()` or pushed via `pushAction()`. The function can modify the action, return a new action, or return `undefined` to prevent the action from being flushed to the client specified.
     * 
     */
    registerActionTransformer(transformer: ActionTransformer) {
        this._transformer = transformer;
    }

    /**
     * @param handler Function that receives events as soon as they happen. The function can return true to allow the event to be queued for further processing via `getEvents()`, or can return false to represent that the event does not need to be handled any further.
     * 
     */
    registerEventHandler(handler: EventHandler) {
        this._eventHandler = handler;
    }

    private _pushEvent(event: any) {
        if (this._eventHandler) event = this._eventHandler;
        if (event) this.events.push(event);
    }

    getEvents() {
        let copy = this.events.slice();
        this.events.length = 0;
        return copy;
    }

    reduxMiddleware() {
        let pushAction = this.pushAction.bind(this);
        return (next) => {
            return (action) => {
                pushAction(action);
                next(action);
            }
        }
    }

    /**
     * @param Action to be queued for a future flush.
     * 
     */
    pushAction(action) {
        this.actions.push(action);
    }

    /**
     * Flushes all actions caught by `reduxMiddleware()` and `pushAction()` to all connected clients. If `registerActionTransformer()` was used, the transformer will be utilized here for each action.
     * 
     */
    flush() {
        if (this.actions.length) console.log(this.actions);
        Object.keys(this.clients).forEach(clientId => {
            let actions = this.actions;
            if (this._transformer) actions = this.actions.map(action => {
                action = this._transformer(clientId, action);
            }).filter(action => action);

            let client = this.clients[clientId];
            if (this.actions.length) client.emit('actions', {actions: this.actions});
        });
        this.actions.length = 0;
    }
}