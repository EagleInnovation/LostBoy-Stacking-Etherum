import { combineReducers } from 'redux';
import AppReducer, { appStateIF } from './AppReducer';
import blockchainReducer, { blockchainStateIF } from './BlockchainReducer';

export interface ReducerStateIF {
    blockchain: blockchainStateIF;
    app: appStateIF;
}
export default combineReducers({
    blockchain: blockchainReducer,
    app: AppReducer
});
