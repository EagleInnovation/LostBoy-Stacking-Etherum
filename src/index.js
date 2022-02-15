import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { MoralisProvider } from "react-moralis";

ReactDOM.render(
  <MoralisProvider appId="IymXGcIpCSUwpCH0c6vYOpMxRx1BSaafdwvMhV4w" serverUrl="https://qnssmudatdip.usemoralis.com:2053/server">
    <App />
  </MoralisProvider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
