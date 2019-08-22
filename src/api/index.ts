import * as request from "superagent";
import {Currency} from "../data/currency";

const API_URL = "https://openexchangerates.org/api/latest.json";

export type FXRateData = {
    base: Currency,
    rates: {
        [key in Currency]: number
    },
};

let base = {
    base: Currency.USD,
    rates: {
        GBP: 3.672538,
        EUR: 3.809999,
        USD: 1,
    },
};

export const loadFXRates = async () => {
    const apiKey = process.env.REACT_APP_FX_KEY;
    if (apiKey) {
        const {body} = await request
            .get(API_URL)
            .query({
                app_id: apiKey,
            });
        return body;
    }

    base.rates.EUR = base.rates.EUR + 0.1; // simulate rate change;
    base = {...base};
    return base;
};
