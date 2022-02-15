import React from 'react';
import store from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch  } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'antd/dist/antd.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Routes from './routes';

const App: React.FC = () => (
    <>
        <Provider store={store}>
            <BrowserRouter>
            <Switch>
                <Routes />
            </Switch>
            </BrowserRouter>
        </Provider>
    </>
);

export default App;