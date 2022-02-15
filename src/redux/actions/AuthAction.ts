import * as types from './types';

export const loginRequest = () => {
    return ((dispatch: any, getState: any) => {
        const { app } = getState();
        const { username, password } = app;
        dispatch({
            type: types.LOGIN_REQUEST,
            payload: { username, password }
        })
    })
}

export const loginSuccess = () => {


}

export const loginFail = () => {


}

