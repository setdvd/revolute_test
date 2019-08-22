import {Pocket} from "../data/pocket";
import * as Pockets from "../data/pocket";
import {State} from "./index";

export const isNotEnoughBalance = (state: State): boolean => {
    const {exchangeFromValue} = state;
    const from = fromPocket(state);
    const amount = parseFloat(exchangeFromValue);
    return !!from && !isNaN(amount) && from.balance < amount;
};

export const fromPocket = (state: State): Pocket | undefined => {
    return Pockets.findById(state.pockets)(state.pocketIdExchangeFrom!);
};

export const toPocket = (state: State): Pocket | undefined => {
    return Pockets.findById(state.pockets)(state.pocketIdExchangeTo!);
};
