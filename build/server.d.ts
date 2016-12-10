export declare type RG_TActionTransformer = (clientId: string, action: any) => any;
export declare type RG_TEventHandler = (event: any) => boolean;
export declare type RG_TGetStateWrapper = () => any;
export declare type RG_TInputHandler = (input: RG_IInput) => void;
export interface RG_IEvent {
    type: string;
    clientId: string;
    state?: any;
}
export interface RG_IInput {
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
    constructor(getState: RG_TGetStateWrapper, inputHandler: any, port?: number);
    /**
     * @param transformer Function that receives all actions that have been caught by `reduxMiddleware()` or pushed via `pushAction()`. The function can modify the action, return a new action, or return `undefined` to prevent the action from being flushed to the client specified.
     *
     */
    registerActionTransformer(transformer: RG_TActionTransformer): void;
    /**
     * @param handler Function that receives events as soon as they happen. The function can return true to allow the event to be queued for further processing via `getEvents()`, or can return false to represent that the event does not need to be handled any further.
     *
     */
    registerEventHandler(handler: RG_TEventHandler): void;
    private _pushEvent(event);
    getEvents(): Array<any>;
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
