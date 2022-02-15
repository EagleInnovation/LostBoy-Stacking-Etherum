import API from "./Api";

export const doLogin = (params: any) => {
    return API.post(
        `user/login`,
        params
    );
};