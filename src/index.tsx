import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import * as api from "./api";
import App from "./App";
import {Currency} from "./data/currency";
import {Pocket} from "./data/pocket";
import "./index.css";
import {pocketsToState, reducer} from "./reducer";

const pockets: [Pocket, Pocket, Pocket] = [
    {
        id: 1,
        currency: Currency.USD,
        balance: 100,
    },
    {
        id: 2,
        currency: Currency.EUR,
        balance: 200,
    },
    {
        id: 3,
        currency: Currency.GBP,
        balance: 300,
    },
];

const POLL_INTERVAL = 10000;

const OPTIONS = {
    api,
    options: {pollInterval: POLL_INTERVAL},
};

const store = createStore(
    reducer,
    pocketsToState(pockets),
    applyMiddleware(thunk.withExtraArgument(OPTIONS)),
);

ReactDOM.render((
    <Provider store={store}>
        <App/>
    </Provider>
), document.getElementById("root"));
