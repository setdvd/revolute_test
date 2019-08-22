import {Currency} from "./currency";

export type Pocket = {
    id: number,
    currency: Currency,
    balance: number,
};

export const findById = (pockets: Pocket[]) => (id: number) => pockets.find((pocket) => pocket.id === id);

// can use ramda or lowdash but just for test task make it simple;
export const updateAmountById = (pockets: Pocket[], id: number, amount: number) => pockets.map((pocket) => {
    if (pocket.id === id) {
        pocket = {
            ...pocket,
            balance: amount,
        };
    }
    return pocket;
});
