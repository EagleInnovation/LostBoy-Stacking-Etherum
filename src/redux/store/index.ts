import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import reducers from '../reducers';
import sagas from '../sagas';

// middleware that logs actions
const loggerMiddleware = createLogger({ predicate: () => true });

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    reducers,
    applyMiddleware(loggerMiddleware, thunk, sagaMiddleware)
);

// run the saga
sagaMiddleware.run(sagas);

export default store;
