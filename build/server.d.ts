export declare type ActionTransformer = (clientId: string, action: any) => any;
export declare type EventHandler = (clientId: string, action: any) => boolean;
export declare type GetStateWrapper = () => any;
export declare type InputHandler = (input: Input) => void;
export interface Event {
    type: string;
    clientId: string;
    state?: any;
}
export interface Input {
    clientId: string;
    name: string;
    value: any;
}
export declare class StateServer {
    private getState;
    private inputHandler;
    private actions;
    private clients;
    private idPool;
    private events;
    private _transformer;
    private _eventHandler;
    /**
     * @param getState Function that retrieves the current state
     * @param inputHandler Function that receives inputs from remote clients
     * @param port Port number to listen on
     *
     */
    constructor(getState: GetStateWrapper, inputHandler: any, port?: number);
    /**
     * @param transformer Function that receives all actions that have been caught by `reduxMiddleware()` or pushed via `pushAction()`. The function can modify the action, return a new action, or return `undefined` to prevent the action from being flushed to the client specified.
     *
     */
    registerActionTransformer(transformer: ActionTransformer): void;
    /**
     * @param handler Function that receives events as soon as they happen. The function can return true to allow the event to be queued for further processing via `getEvents()`, or can return false to represent that the event does not need to be handled any further.
     *
     */
    registerEventHandler(handler: EventHandler): void;
    private _pushEvent(event);
    getEvents(): any[];
    reduxMiddleware(): (next: any) => (action: any) => void;
    /**
     * @param Action to be queued for a future flush.
     *
     */
    pushAction(action: any): void;
    /**
     * Flushes all actions caught by `reduxMiddleware()` and `pushAction()` to all connected clients. If `registerActionTransformer()` was used, the transformer will be utilized here for each action.
     *
     */
    flush(): void;
}
