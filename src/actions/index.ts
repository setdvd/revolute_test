import {ThunkAction} from "redux-thunk";
import {FXRateData} from "../api";
import * as API from "../api";
import {State} from "../reducer";

type Extra = { api: typeof API, options: { pollInterval: number } };
type TAction = ThunkAction<any, State, Extra, Action>;

export type Action = {
    type: "RATES_LOADED",
    payload: FXRateData,
} | {
    type: "SUBSCRIBED",
    payload: ReturnType<typeof setInterval>,
} | {
    type: "UNSUBSCRIBED",
} | {
    type: "FROM_POCKET_CHANGE",
    payload: string,
} | {
    type: "TO_POCKET_CHANGE",
    payload: string,
} | {
    type: "ON_EXCHANGE",
} | {
    type: "ON_CHANGE_FROM_POCKET_VALUE",
    payload: string,
} | {
    type: "ON_CHANGE_TO_POCKET_VALUE",
    payload: string,
};

export const ratesLoaded = (rates: FXRateData): Action => ({
    type: "RATES_LOADED",
    payload: rates,
});

export const subscribed = (intervalId: ReturnType<typeof setInterval>): Action => ({
    type: "SUBSCRIBED",
    payload: intervalId,
});

export const unsubscribed = (): Action => ({
    type: "UNSUBSCRIBED",
});

export const fromPocketChange = (pocketId: string): Action => ({
    type: "FROM_POCKET_CHANGE",
    payload: pocketId,
});

export const toPocketChange = (pocketId: string): Action => ({
    type: "TO_POCKET_CHANGE",
    payload: pocketId,
});

export const subscribeToFX = (): TAction => (dispatch, getState, {api, options: {pollInterval}}) => {
    const state = getState();
    let {pollIntervalId} = state;
    if (state.subscriberCounter === 0) {
        const poll = async () => {
            try {
                const rates = await api.loadFXRates();
                dispatch(ratesLoaded(rates));
            } catch (e) {
                // do nothing on error; even if one request fails we poll every 10 sec so next one should be good;
            }
        };
        poll();
        pollIntervalId = setInterval(poll, pollInterval);
    }
    dispatch(subscribed(pollIntervalId!));
};

export const unsubscribeFromFX = (): TAction => (dispatch, getState) => {
    const {subscriberCounter, pollIntervalId} = getState();
    if (subscriberCounter === 1 && pollIntervalId) {
        clearInterval(pollIntervalId);
    }
    dispatch(unsubscribed());
};

export const onChangeFromPocketValue = (input: string): Action => ({
    type: "ON_CHANGE_FROM_POCKET_VALUE",
    payload: input,
});

export const onChangeToPocketValue = (input: string): Action => ({
    type: "ON_CHANGE_TO_POCKET_VALUE",
    payload: input,
});

export const onExchange = (): Action => ({
    type: "ON_EXCHANGE",
});
