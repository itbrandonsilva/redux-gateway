"use strict";
var sio = require("socket.io");
;
;
var StateServer = (function () {
    /**
     * @param getState Function that retrieves the current state
     * @param inputHandler Function that receives inputs from remote clients
     * @param port Port number to listen on
     *
     */
    function StateServer(getState, inputHandler, port) {
        if (port === void 0) { port = 7541; }
        var _this = this;
        this.getState = getState;
        this.inputHandler = inputHandler;
        this.actions = [];
        this.clients = {};
        this.idPool = 0;
        this.events = [];
        var io = sio(port);
        io.on('connection', function (socket) {
            var clientId = (++_this.idPool).toString();
            var state = _this.getState();
            socket.emit('init', { state: state, clientId: clientId });
            _this.clients[clientId] = socket;
            _this._pushEvent({ type: 'CLIENT_CONNECT', state: state, clientId: clientId });
            socket.on('input', function (input) {
                _this.inputHandler({ clientId: clientId, name: input.name, value: input.value });
            });
            socket.on('disconnect', function () {
                delete _this.clients[clientId];
                _this._pushEvent({ type: 'CLIENT_DISCONNECT', clientId: clientId });
            });
        });
    }
    /**
     * @param transformer Function that receives all actions that have been caught by `reduxMiddleware()` or pushed via `pushAction()`. The function can modify the action, return a new action, or return `undefined` to prevent the action from being flushed to the client specified.
     *
     */
    StateServer.prototype.registerActionTransformer = function (transformer) {
        this._transformer = transformer;
    };
    /**
     * @param handler Function that receives events as soon as they happen. The function can return true to allow the event to be queued for further processing via `getEvents()`, or can return false to represent that the event does not need to be handled any further.
     *
     */
    StateServer.prototype.registerEventHandler = function (handler) {
        this._eventHandler = handler;
    };
    StateServer.prototype._pushEvent = function (event) {
        if (this._eventHandler)
            this.events.push(event);
        var result = this._eventHandler(event);
        if (result)
            this.events.push(event);
    };
    StateServer.prototype.getEvents = function () {
        var copy = this.events.slice();
        this.events.length = 0;
        return copy;
    };
    StateServer.prototype.reduxMiddleware = function () {
        var pushAction = this.pushAction.bind(this);
        return function (next) {
            return function (action) {
                pushAction(action);
                next(action);
            };
        };
    };
    /**
     * @param Action to be queued for a future flush.
     *
     */
    StateServer.prototype.pushAction = function (action) {
        this.actions.push(action);
    };
    /**
     * Flushes all actions caught by `reduxMiddleware()` and `pushAction()` to all connected clients. If `registerActionTransformer()` was used, the transformer will be utilized here for each action.
     *
     */
    StateServer.prototype.flush = function () {
        var _this = this;
        Object.keys(this.clients).forEach(function (clientId) {
            var actions = _this.actions;
            if (_this._transformer)
                actions = _this.actions.map(function (action) {
                    action = _this._transformer(clientId, action);
                }).filter(function (action) { return action; });
            var client = _this.clients[clientId];
            if (_this.actions.length)
                client.emit('actions', { actions: _this.actions });
        });
        this.actions.length = 0;
    };
    return StateServer;
}());
exports.StateServer = StateServer;
