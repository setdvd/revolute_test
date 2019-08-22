import * as Enzyme from "enzyme";
import {mount as renderer} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import App from "./App";
import {Currency} from "./data/currency";
import {Pocket} from "./data/pocket";
import {pocketsToState, reducer} from "./reducer";

beforeAll(() => {
    Enzyme.configure({adapter: new Adapter()});
});

describe("App", () => {
    const FROM_INPUT_CLASS = ".test-from-input";
    const TO_INPUT_CLASS = ".test-to-input";
    const FROM_POCKET_AMOUNT_CLASS = ".test-from-pocket-amount";
    const TO_POCKET_AMOUNT_CLASS = ".test-to-pocket-amount";
    const SELECT_FROM_POCKET = ".test-select-from-pocket";
    const SELECT_TO_POCKET = ".test-select-to-pocket";
    const EXCHANGE_BTN = ".test-exchange";
    const ON_UNIT_CONVERSION_RATE = ".test-one-unit-conversion";
    const FROM_ERROR_MESSAGE = ".test-from-error-message";

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

    const ratesData = {
        base: Currency.USD,
        rates: {
            GBP: 3.672538,
            EUR: 66.7709999,
            USD: 1,
        },
    };
    let api: { loadFXRates: jest.Mock<Promise<typeof ratesData>, []> };
    const POLL_INTERVAL = 1000;
    const options = {
        pollInterval: POLL_INTERVAL,
    };
    let wrapper: ReturnType<typeof renderer>;

    const onChange = (selector: string, value: any) => {
        wrapper
            .find(selector)
            .first()!
            .props()!
            .onChange!({target: {value}} as any);
        wrapper.update();
        return wrapper;
    };

    beforeAll(() => {
        jest.useFakeTimers();
    });

    beforeEach(() => {
        api = {
            loadFXRates: jest.fn().mockResolvedValue(ratesData),
        };
        const store = createStore(reducer, pocketsToState(pockets), applyMiddleware(thunk.withExtraArgument({
            api,
            options,
        })));
        wrapper = renderer(
            <Provider store={store}>
                <App/>
            </Provider>,
        );

    });

    afterAll(() => {
        jest.useRealTimers();
    });
    afterEach(() => {
        wrapper.unmount();
    });

    describe("FXRate fetching", () => {

        it("should load exchange rates on first render", async () => {
            expect(api.loadFXRates.mock.calls.length).toEqual(1);
        });
        it("should poll data every N seconds", async () => {
            jest.advanceTimersByTime(POLL_INTERVAL * 2);
            expect(api.loadFXRates.mock.calls.length).toEqual(3);
        });
        it("should stop polling after unmount", () => {
            jest.advanceTimersByTime(POLL_INTERVAL * 2);
            wrapper.unmount();
            jest.advanceTimersByTime(POLL_INTERVAL * 2);
            expect(api.loadFXRates.mock.calls.length).toEqual(3);
            wrapper = renderer(<div></div>); // render smth to unmount in afterEachHook;
        });
    });

    describe("Pocket information", () => {
        it("should render amount left on from pocket", () => {
            expect(wrapper.find(FROM_POCKET_AMOUNT_CLASS).text()).toEqual("100.00 $");
        });
        it("should render amount left on to pocket", () => {
            expect(wrapper.find(TO_POCKET_AMOUNT_CLASS).text()).toEqual("200.00 €");
        });
        it("should allow to change from pocket and render correct pocket info", () => {
            onChange(SELECT_FROM_POCKET, 2);
            expect(wrapper.find(FROM_POCKET_AMOUNT_CLASS).text()).toEqual("200.00 €");
        });
        it("should allow to change to pocket and render correct pocket info", () => {
            onChange(SELECT_TO_POCKET, 3);
            expect(wrapper.find(TO_POCKET_AMOUNT_CLASS).text()).toEqual("300.00 £");
        });
        it("should initially render correct currency for the to pocket", () => {
            expect(wrapper.find(SELECT_TO_POCKET).first().props().value).toEqual("2");
        });
        it("should initially render correct currency for the from pocket", () => {
            expect(wrapper.find(SELECT_FROM_POCKET).first().props().value).toEqual("1");
        });
    });

    describe("Exchange currency validation & data sync", () => {
        it("should render from & to pocket input", () => {
            expect(wrapper.find(FROM_INPUT_CLASS).length).toEqual(1);
            expect(wrapper.find(TO_INPUT_CLASS).length).toEqual(1);
        });

        it("should allow to enter number into to field", () => {
            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "100"}});

            expect(
                wrapper
                    .find(FROM_INPUT_CLASS)
                    .props()
                    .value).toEqual("100");
        });
        it("should NOT allow to enter letters", () => {
            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "asdf"}});

            expect(
                wrapper
                    .find(FROM_INPUT_CLASS)
                    .props()
                    .value).toEqual("");
        });
        it("should NOT allow to enter commas", () => {
            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "100"}})
                .simulate("change", {target: {value: "100,"}});

            expect(
                wrapper
                    .find(FROM_INPUT_CLASS)
                    .props()
                    .value).toEqual("100");
        });
        it("should NOT allow to enter more than 2 digits after dot", () => {
            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "100.00"}})
                .simulate("change", {target: {value: "100.000"}});

            expect(
                wrapper
                    .find(FROM_INPUT_CLASS)
                    .props()
                    .value).toEqual("100.00");
        });
        it("should allow to enter one dot in number", () => {
            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "100."}});

            expect(
                wrapper
                    .find(FROM_INPUT_CLASS)
                    .props()
                    .value).toEqual("100.");
        });

        it("should allow to enter empty value", () => {
            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "100"}})
                .simulate("change", {target: {value: ""}});

            expect(
                wrapper
                    .find(FROM_INPUT_CLASS)
                    .props()
                    .value).toEqual("");
        });

        it("should allow to enter one dot in number", () => {
            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "100."}});

            expect(
                wrapper
                    .find(FROM_INPUT_CLASS)
                    .props()
                    .value).toEqual("100.");
        });
        it("should allow to enter 2 digit precision number", () => {
            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "100."}});

            expect(
                wrapper
                    .find(FROM_INPUT_CLASS)
                    .props()
                    .value).toEqual("100.");

        });
        it("should convert from pocket to pocket according to the current rates", () => {
            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "100.00"}});

            expect(
                wrapper
                    .find(TO_INPUT_CLASS)
                    .props()
                    .value).toEqual("6677.10");
        });
        it("should convert to pocket from pocket according to the current rates", () => {
            wrapper
                .find(TO_INPUT_CLASS)
                .simulate("change", {target: {value: "44.45"}});

            expect(
                wrapper
                    .find(FROM_INPUT_CLASS)
                    .props()
                    .value).toEqual("0.67");
        });

        it("should recalculate to field when from field currency changed", () => {

            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "100.00"}});

            onChange(SELECT_FROM_POCKET, "2");

            expect(wrapper.find(TO_INPUT_CLASS).props().value).toEqual("1.50");
        });

        it("should recalculate to field when to field currency changed and from was last changed value", () => {
            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "100.00"}});
            onChange(SELECT_TO_POCKET, "3");
            expect(wrapper.find(TO_INPUT_CLASS).props().value).toEqual("367.25");
        });

        it("should recalculate from field when to field currency changed and to was last changed value", () => {
            wrapper
                .find(TO_INPUT_CLASS)
                .simulate("change", {target: {value: "100.00"}});
            onChange(SELECT_TO_POCKET, 3);
            expect(wrapper.find(TO_INPUT_CLASS).props().value).toEqual("100.00");
            expect(wrapper.find(FROM_INPUT_CLASS).props().value).toEqual("27.23");
        });

        it("should update to field if from input was updated last when exchange rate changed", async () => {
            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "50"}});
            api.loadFXRates.mockImplementation(() => Promise.resolve({
                base: Currency.USD,
                rates: {
                    GBP: 5,
                    EUR: 2.5,
                    USD: 1,
                },
            }));
            jest.advanceTimersByTime(POLL_INTERVAL);
            await Promise.resolve();
            wrapper.update();
            expect(wrapper.find(TO_INPUT_CLASS).props().value).toEqual("125.00");
        });
        it("should show correct 1 unit of from currency to currency conversion", () => {
            expect(wrapper.find(ON_UNIT_CONVERSION_RATE).first().text()).toEqual("1 $ = 66.7710 €");
        });
        it("should show correct 1 unit of from currency conversion on rates update", async () => {
            api.loadFXRates.mockImplementation(() => Promise.resolve({
                base: Currency.USD,
                rates: {
                    GBP: 5,
                    EUR: 2.5,
                    USD: 1,
                },
            }));
            jest.advanceTimersByTime(POLL_INTERVAL);
            await Promise.resolve();
            wrapper.update();
            expect(wrapper.find(ON_UNIT_CONVERSION_RATE).first().text()).toEqual("1 $ = 2.5000 €");
        });
        it("should update from input if to input was updated last when exchange rate changed", async () => {
            wrapper
                .find(TO_INPUT_CLASS)
                .simulate("change", {target: {value: "50"}});
            api.loadFXRates.mockImplementation(() => Promise.resolve({
                base: Currency.USD,
                rates: {
                    GBP: 5,
                    EUR: 2.5,
                    USD: 1,
                },
            }));
            jest.advanceTimersByTime(POLL_INTERVAL);
            await Promise.resolve();
            wrapper.update();
            expect(wrapper.find(FROM_INPUT_CLASS).props().value).toEqual("20.00");
        });
    });
    describe("Error state", () => {
        it("should show error on to field when from field currency changed and not enough balance", () => {
            wrapper
                .find(TO_INPUT_CLASS)
                .simulate("change", {target: {value: "50"}});
            expect(wrapper.exists(FROM_ERROR_MESSAGE)).toBeFalsy();
            wrapper
                .find(TO_INPUT_CLASS)
                .simulate("change", {target: {value: "50000000"}});
            onChange(SELECT_TO_POCKET, "3");
            expect(wrapper.exists(FROM_ERROR_MESSAGE)).toBeTruthy();
        });
        it("should show error if amount to exchange is greater then amount on from pocket", () => {
            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "500"}});
            expect(wrapper.find(TO_INPUT_CLASS).props().value).toEqual("33385.50");
            expect(wrapper.exists(FROM_ERROR_MESSAGE)).toBeTruthy();
        });
        it("should disable exchange button if enough balance", () => {
            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "500"}});
            expect(wrapper.find(EXCHANGE_BTN).first().props().disabled).toBeTruthy();
        });
    });
    describe("Exchange operation", () => {
        it("should exchange money and update to and from pocket info", () => {
            wrapper
                .find(FROM_INPUT_CLASS)
                .simulate("change", {target: {value: "100"}});

            wrapper
                .find(EXCHANGE_BTN)
                .first()
                .simulate("click", {});

            expect(wrapper.find(FROM_POCKET_AMOUNT_CLASS).text()).toEqual("0.00 $");
            expect(wrapper.find(TO_POCKET_AMOUNT_CLASS).text()).toEqual("6,877.10 €");

        });
    });
});
