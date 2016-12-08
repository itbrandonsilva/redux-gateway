export declare class StateClient {
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
    constructor(initCb: any, actionsCb: any, host?: string, port?: number);
    /**
     * Emits an an input in the form of a `name` and a `value` to the `StateServer`.
     * @param name Name of the input.
     * @param value Value of the Input.
     *
     */
    sendInput(name: any, value: any): void;
}
