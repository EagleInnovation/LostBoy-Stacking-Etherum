/**
 * Wrapper function above Axios lib 
 * @author Chintan Prajapati
 */

import { API_URL } from "../../config";

const axios = require('axios');
/** Set base url for api */
axios.defaults.baseURL = API_URL;

/**
 * Parse and return HTTP API response
 * @param res
 */
const getResponse = (res?: any) => {
    console.log(res);
    if (res && (res.status === 200 || res.status === 201 || res.status === 204)) {
        return res.data;
    }
    throw new Error('Some error occur');
};

/**
 * Get request
 * @param path      API url path
 * @param params    Request parameters
 * @param headers    Request header
 */
export const get = (path: string, params?: any, headers?: any) => {
    return new Promise((resolve, reject) => {
        try {
            axios
                .get(path, { headers, params })
                .then(getResponse)
                .then(resolve)
                .catch(reject);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Post request
 * @param path      API url path
 * @param params    Request parameters
 */
export const post = (path: string, params?: any, headers?: any) => {
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(path, params, { headers })
                .then(getResponse)
                .then(resolve)
                .catch(reject);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Put request
 * @param path      API url path
 * @param params    Request parameters
 * @param headers   Request headers
 */
export const put = (path: string, params?: any, headers?: any) => {
    return new Promise((resolve, reject) => {
        try {
            axios
                .put(path, params, { headers })
                .then(getResponse)
                .then(resolve)
                .catch(reject);
        } catch (error) {
            reject(error);
        }
    });
};

export default { get, post, put };
