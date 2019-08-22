import {Grid} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import cn from "classnames";
import React from "react";
import {connect} from "react-redux";
import {
    fromPocketChange,
    onChangeFromPocketValue,
    onChangeToPocketValue,
    onExchange,
    toPocketChange,
} from "./actions";
import {FXRateData} from "./api";
import {CurrencyInput} from "./components/currencyInput";
import {CurrencySelector} from "./components/currencySelector";
import {ExchangeButton} from "./components/exchangeButton";
import {FXPoller} from "./components/fxPoller";
import {Rate} from "./components/rate";
import {ThemeProvider} from "./components/themeProvider";
import * as Currency from "./data/currency";
import {Pocket} from "./data/pocket";
import * as State from "./reducer";

type TActions = {
    fromPocketChange: (id: string) => any,
    toPocketChange: (id: string) => any,
    onChangeFromPocketValue: (input: string) => any,
    onChangeToPocketValue: (input: string) => any,
    onExchange: () => any,
};

type TState = {
    fromPocket?: Pocket,
    toPocket?: Pocket,
    pockets: Pocket[],
    exchangeToValue: string,
    exchangeFromValue: string,
    exchangeRates?: FXRateData,
    isNotEnoughBalance: boolean,
};

type Props = TActions & TState;

const useStyles = makeStyles((theme) => ({
    spacing: {
        padding: "3rem 0",
        [theme.breakpoints.down("xs")]: {
            padding: "0.5rem",
        },
    },
    mainContainerSpacing: {
        padding: "1.5rem 0",
    },
    xsSmallFont: {
        [theme.breakpoints.down("xs")]: {
            fontSize: "2rem",
        },
    },
}));

const App = (props: Props) => {
    const {
        fromPocket,
        toPocket,
        pockets,
        exchangeFromValue,
        exchangeToValue,
        onChangeFromPocketValue: fromChange,
        onChangeToPocketValue: toChange,
        onExchange: exchange,
        isNotEnoughBalance,
        exchangeRates,
        toPocketChange: onToPocketChange,
        fromPocketChange: onFromPocketChange,
    } = props;
    const classes = useStyles();

    if (!toPocket || !fromPocket) {
        throw new Error("no selected pockets");
    }

    const rate = Currency.calculateRateString(fromPocket.currency, toPocket.currency, exchangeRates);

    return (
        <ThemeProvider>
            <FXPoller>
                <CssBaseline/>
                <Container maxWidth={"md"}>
                    <Grid container direction={"column"} style={{margin: "24px 0"}}>
                        <Typography className={cn(classes.spacing, classes.xsSmallFont)} align={"center"}
                                    variant={"h3"}>Exchange
                            money</Typography>
                        <Grid className={classes.spacing} container spacing={3} direction={"row"}>
                            <Grid item xs={12} sm={6}
                            >
                                <CurrencySelector
                                    label={"From"}
                                    value={`${fromPocket.id}`}
                                    onChange={(e) => onFromPocketChange(e.target.value)}
                                    pockets={pockets}
                                    pocket={fromPocket}
                                    inputClassName={"test-select-from-pocket"}
                                    balanceClassName={"test-from-pocket-amount"}
                                />
                                <CurrencyInput
                                    value={exchangeFromValue}
                                    onChange={(e) => fromChange(e.target.value)}
                                    helpText={isNotEnoughBalance ? "exceeds balance" : undefined}
                                    inputClass={"test-from-input"}
                                    currency={fromPocket.currency}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <CurrencySelector
                                    label={"To"}
                                    value={`${toPocket.id}`}
                                    onChange={(e) => onToPocketChange(e.target.value)}
                                    pockets={pockets}
                                    pocket={toPocket}
                                    inputClassName={"test-select-to-pocket"}
                                    balanceClassName={"test-to-pocket-amount"}
                                />

                                <CurrencyInput
                                    value={exchangeToValue}
                                    onChange={(e) => toChange(e.target.value)}
                                    inputClass={"test-to-input"}
                                    currency={toPocket.currency}
                                />

                            </Grid>
                        </Grid>
                        <Grid container spacing={3} direction={"row"}>
                            <Grid item xs={6}>
                                <ExchangeButton
                                    disabled={isNotEnoughBalance}
                                    className={"test-exchange"}
                                    onClick={exchange}/>
                            </Grid>
                            <Grid item xs={6}>
                                <Rate rate={rate}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </FXPoller>
        </ThemeProvider>
    );
};

export default connect<TState, TActions, {}, State.State>(
    (state) => {
        const {exchangeFromValue, exchangeToValue, pockets, exchangeRates} = state;
        return {
            fromPocket: State.fromPocket(state),
            toPocket: State.toPocket(state),
            pockets,
            exchangeFromValue,
            exchangeToValue,
            exchangeRates,
            isNotEnoughBalance: State.isNotEnoughBalance(state),
        };
    },
    {
        toPocketChange,
        fromPocketChange,
        onChangeFromPocketValue,
        onChangeToPocketValue,
        onExchange,
    })(App);
