import {Reducer} from "redux";
import {Action} from "../actions";
import {FXRateData} from "../api";
import * as Currencies from "../data/currency";
import {Pocket} from "../data/pocket";
import * as Pockets from "../data/pocket";
import {setFromValue, setToValue, updateInputValue, updateValueBasedOnLastInputChanged} from "./helpers";

export type AppReducer = Reducer<State, Action>;
export * from "./selectors";

export type State = {
    pockets: Pocket[],
    selectedPocket: number,
    exchangeRates?: FXRateData,
    pollIntervalId?: ReturnType<typeof setInterval>,
    subscriberCounter: number,
    pocketIdExchangeFrom?: number,
    pocketIdExchangeTo?: number,
    exchangeFromValue: string,
    exchangeToValue: string,
    lastInputUpdated?: "from" | "to",
};

export const defaultState: State = {
    pockets: [],
    selectedPocket: 0,
    subscriberCounter: 0,
    exchangeFromValue: "",
    exchangeToValue: "",
};

export const pocketsToState = (pockets: [Pocket, Pocket, Pocket]): State => {
    const [first, second] = pockets;
    return {
        ...defaultState,
        pocketIdExchangeFrom: first.id,
        pocketIdExchangeTo: second.id,
        pockets,
    };
};

export const reducer: AppReducer = (state: State = defaultState, action: Action) => {
    switch (action.type) {
        case "RATES_LOADED": {
            state = {
                ...state,
                exchangeRates: action.payload,
            };
            return updateValueBasedOnLastInputChanged(state);
        }
        case "SUBSCRIBED": {
            return {
                ...state,
                pollIntervalId: action.payload,
                subscriberCounter: state.subscriberCounter + 1,
            };
        }
        case "UNSUBSCRIBED": {
            return {
                ...state,
                subscriberCounter: state.subscriberCounter - 1,
            };
        }
        case "FROM_POCKET_CHANGE": {
            const pocketIdExchangeFrom = parseInt(action.payload, 10);
            const pocketIdExchangeTo = pocketIdExchangeFrom === state.pocketIdExchangeTo ?
                state.pocketIdExchangeFrom : state.pocketIdExchangeTo;
            if (!isNaN(pocketIdExchangeFrom)) {
                state = {
                    ...state,
                    pocketIdExchangeTo,
                    pocketIdExchangeFrom,
                };
            }
            return updateValueBasedOnLastInputChanged(state);
        }
        case "TO_POCKET_CHANGE": {
            const pocketIdExchangeTo = parseInt(action.payload, 10);
            const pocketIdExchangeFrom = pocketIdExchangeTo === state.pocketIdExchangeFrom ?
                state.pocketIdExchangeTo : state.pocketIdExchangeFrom;

            if (!isNaN(pocketIdExchangeTo)) {
                state = {
                    ...state,
                    pocketIdExchangeFrom,
                    pocketIdExchangeTo,
                };
            }

            return updateValueBasedOnLastInputChanged(state);
        }

        case "ON_EXCHANGE": {
            const {exchangeFromValue, pocketIdExchangeTo, pocketIdExchangeFrom, exchangeRates} = state;
            let {pockets} = state;
            const byId = Pockets.findById(pockets);
            if (exchangeFromValue && pockets && pocketIdExchangeTo && pocketIdExchangeFrom && exchangeRates) {
                const from = byId(pocketIdExchangeFrom);
                const to = byId(pocketIdExchangeTo);
                const input = parseFloat(exchangeFromValue);
                if (!isNaN(input) && from && to) {
                    const amount = Currencies.convert(input, {
                        from: from.currency,
                        to: to.currency,
                        ...exchangeRates,
                    });
                    pockets = Pockets.updateAmountById(pockets, from.id, from.balance - input);
                    pockets = Pockets.updateAmountById(pockets, to.id, to.balance + amount);
                    state = {
                        ...state,
                        pockets,
                        exchangeFromValue: "",
                        exchangeToValue: "",
                    };
                }
            }
            return state;

        }
        case "ON_CHANGE_FROM_POCKET_VALUE": {
            const {pocketIdExchangeFrom, pocketIdExchangeTo} = state;
            if (pocketIdExchangeFrom && pocketIdExchangeTo) {
                state = updateInputValue(
                    action.payload,
                    pocketIdExchangeFrom,
                    pocketIdExchangeTo,
                    setFromValue,
                    setToValue,
                    state);
            }
            return state;
        }
        case "ON_CHANGE_TO_POCKET_VALUE": {
            const {pocketIdExchangeFrom, pocketIdExchangeTo} = state;
            if (pocketIdExchangeFrom && pocketIdExchangeTo) {
                state = updateInputValue(
                    action.payload,
                    pocketIdExchangeTo,
                    pocketIdExchangeFrom,
                    setToValue,
                    setFromValue,
                    state);
            }
            return state;
        }

        default:
            return state;

    }
};
