import * as Immutable from 'immutable';

const DEFAULT = Immutable.fromJS({
    players: {},
});

export function reducer(state = DEFAULT, action) {
    if (action.type !== 'ACTIONS') action = {type: 'ACTIONS', actions: [action]};

    let players;
    return action.actions.reduce((state, action) => {
        switch (action.type) {
            case 'INIT_STATE':
                return Immutable.fromJS(action.state);
            case 'ADD_PLAYER':
                return state.setIn(['players', action.playerId], Immutable.Map({x: 300, y: 300}));
            case 'REMOVE_PLAYER':
                return state.deleteIn(['players', action.playerId]);
            case 'MOVE_LEFT':
                return state.updateIn(['players', action.playerId, 'x'], x => x-5 );
            case 'MOVE_RIGHT':
                return state.updateIn(['players', action.playerId, 'x'], x => x+5 );
            default:
                return state;
        }
    }, state);
}