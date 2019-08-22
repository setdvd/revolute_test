import {formatMoney} from "accounting";
import * as Currencies from "../data/currency";
import * as Pockets from "../data/pocket";
import {State} from "./index";

const FORMAT_MONEY_FOR_INPUT = {
    precision: 2,
    thousand: "",
    format: "%v",
};

export const updateInputValue = (
    input: string,
    fromId: number,
    toId: number,
    fromChange: (value: string, state: State) => State,
    toChange: (value: string, state: State) => State,
    state: State,
): State => {
    if (!input) {
        state = toChange(input, state);
        state = fromChange(input, state);
    }

    if (Currencies.isValidMoneyInput(input)) {
        const {pockets, exchangeRates} = state;
        const [fromPocket, toPocket] = [fromId, toId].map(Pockets.findById(pockets));
        const parsed = parseFloat(input);
        if (fromPocket && toPocket && exchangeRates && !isNaN(parsed)) {
            const converted = Currencies.convert(parsed, {
                from: fromPocket.currency,
                to: toPocket.currency,
                ...exchangeRates,
            });
            const formattedValue = formatMoney(converted, FORMAT_MONEY_FOR_INPUT);
            state = toChange(formattedValue, state);
        }
        state = fromChange(input, state);
    }
    return state;
};

const updateFromValue = (input: string, state: State): State => {
    const {pocketIdExchangeFrom, pocketIdExchangeTo} = state;
    if (pocketIdExchangeFrom && pocketIdExchangeTo) {
        state = updateInputValue(input, pocketIdExchangeFrom, pocketIdExchangeTo, setFromValue, setToValue, state);
    }
    return state;
};

const updateToValue = (input: string, state: State): State => {
    const {pocketIdExchangeFrom, pocketIdExchangeTo} = state;
    if (pocketIdExchangeFrom && pocketIdExchangeTo) {
        state = updateInputValue(input, pocketIdExchangeTo, pocketIdExchangeFrom, setToValue, setFromValue, state);
    }
    return state;
};

export const updateValueBasedOnLastInputChanged = (state: State): State => {
    const {exchangeToValue, exchangeFromValue, lastInputUpdated} = state;
    const [value, update] = lastInputUpdated === "to" ?
        [exchangeToValue, updateToValue] :
        [exchangeFromValue, updateFromValue];
    return update(value, state);
};

export const setFromValue = (value: string, state: State): State => ({
    ...state,
    exchangeFromValue: value,
    lastInputUpdated: "from",
});

export const setToValue = (value: string, state: State): State => ({
    ...state,
    exchangeToValue: value,
    lastInputUpdated: "to",
});
