import { StateServer } from '../../src/server';
import { reducer } from './reducer'
import { createStore, applyMiddleware } from 'redux';

class Game {
    private store;
    private server: StateServer;
    private playerInputs = {};

    constructor(reducer) {
        this.server = new StateServer(() => this.store.getState(), this.receivePlayerInput.bind(this));
        this.store = createStore(reducer, applyMiddleware(this.server.reduxMiddleware.bind(this.server)));
        this.start();
    }

    start(interval=33) {
        setInterval(this.tick.bind(this), interval);
    }

    tick() {
        let events = this.server.getEvents();
        events.forEach(event => {
            switch (event.type) {
                case 'CLIENT_CONNECT':
                    console.log('CONNECTION');
                    this.playerInputs[event.clientId] = {};
                    break;
                case 'CLIENT_DISCONNECT':
                    console.log('DISCONNECTION');
                    delete this.playerInputs[event.clientId];
                    break;
            }
        });

        let inputs = this.playerInputs;
        this.store.dispatch({type: 'TICK', inputs, events});
        this.server.flush();
    }

    receivePlayerInput(input) {
        console.log(input);
        this.playerInputs[input.clientId][input.name] = input.value;
    }

}

const game = new Game(reducer);
