import * as types from '../actions/types';

export interface appStateIF {
    loader: boolean;
    username: string | null;
    password: string | null;
}

const initialState: appStateIF = {
    loader: false,
    username: null,
    password: null
};

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.INIT_APP:
            return { ...state, ...action.payload, loader: false };
        case types.LOGIN_REQUEST:
            return { ...state, loader: true };
        case types.LOGIN_SUCCESS:
            return { ...state, loader: false };
        default:
            return state;
    }
};

export default reducer;
