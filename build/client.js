"use strict";
var sio = require("socket.io-client");
var StateClient = (function () {
    /**
     * @param initCb Callback to receive the initial state from the `StateServer`.
     * @param actionsCb Callback to receive actions flushed by the `StateServer`.
     * @param host `StateServer` host address.
     * @param port `StateServer` port.
     *
     */
    function StateClient(initCb, actionsCb, host, port) {
        if (host === void 0) { host = '127.0.0.1'; }
        if (port === void 0) { port = 7541; }
        var _this = this;
        this.socket = sio(host + ':' + port);
        this.socket.on('init', function (data) {
            _this.clientId = data.clientId;
            initCb(null, data.state, data.clientId);
        });
        this.socket.on('actions', function (data) {
            actionsCb(data.actions);
        });
    }
    /**
     * Emits an an input in the form of a `name` and a `value` to the `StateServer`.
     * @param name Name of the input.
     * @param value Value of the Input.
     *
     */
    StateClient.prototype.sendInput = function (name, value) {
        if (!this.socket)
            throw new Error('sendInput(): Must be connected to server before inputs can be sent.');
        this.socket.emit('input', { name: name, value: value });
    };
    return StateClient;
}());
exports.StateClient = StateClient;
