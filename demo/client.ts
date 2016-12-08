import { StateClient } from '../src/client';
import { reducer } from './reducer';
import * as Redux from 'redux';

let store = Redux.createStore(reducer);

let client = new StateClient(
    () => {},
    actions => {
        store.dispatch({type: 'ACTIONS', actions});
    }
);

document.addEventListener('keydown', e => {
    console.log(e.keyCode);
    if (e.keyCode === 37) client.sendInput('left', true);
    if (e.keyCode === 39) client.sendInput('right', true);
});

document.addEventListener('keyup', e => {
    console.log(e.keyCode);
    if (e.keyCode === 37) client.sendInput('left', false);
    if (e.keyCode === 39) client.sendInput('right', false);
});

store.subscribe(() => {
    console.log(JSON.stringify(store.getState()));
});