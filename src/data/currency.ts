import {formatMoney} from "accounting";
import {convert} from "cashify";
import {FXRateData} from "../api";

export {convert} from "cashify";

export enum Currency {
    EUR = "EUR",
    USD = "USD",
    GBP = "GBP",
}

const CURRENCY_TO_SYMBOL: { [key in Currency]: string } = {
    [Currency.USD]: "$",
    [Currency.EUR]: "€",
    [Currency.GBP]: "£",
};

export const toSymbol = (currency: Currency): string => CURRENCY_TO_SYMBOL[currency];

export const format = (amount: string | number, currency: Currency, precision: number = 2) =>
    formatMoney(parseFloat(`${amount}`), {
        symbol: toSymbol(currency),
        precision,
        decimal: ".",
        format: "%v %s",
    });

/**
 *  @description: return if string is valid money input.
 *  @example:
 *      good: 10, 10., 0, 0.0
 *      bad: a, 10.000, 10,00
 *  @param amount:string
 */
export const isValidMoneyInput = (amount: string): boolean => /^\d+(?:\.\d{0,2})?$/g.test(amount);

export const calculateRateString = (from?: Currency, to?: Currency, exchangeRates?: FXRateData) => {
    if (!from || !to || !exchangeRates) {
        return "";
    }
    return `1 ${toSymbol(from)} = ${format(convert(1, {
        from,
        to,
        ...exchangeRates,
    }), to, 4)}`;
};
