import {FormControl, Input, makeStyles} from "@material-ui/core";
import {FormHelperText} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import * as React from "react";
import {ChangeEvent} from "react";
import * as Currency from "../data/currency";

type Props = {
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => any,
    inputClass?: string,
    helpText?: string,
    currency: Currency.Currency,
};

const useStyles = makeStyles(() => ({
    inputSize: {
        fontSize: "5rem",
        fontWeight: 200,
        maxWidth: "100%",
    },
}));

export const CurrencyInput = ({value, onChange, inputClass, helpText, currency}: Props) => {
    const classes = useStyles();
    return (
        <FormControl margin={"normal"}>
            <Input
                className={classes.inputSize}
                disableUnderline
                id="adornment-amount"
                value={value}
                onChange={onChange}
                startAdornment={<InputAdornment disableTypography
                                                className={classes.inputSize}
                                                position="start">{Currency.toSymbol(currency)}</InputAdornment>}
                inputProps={{
                    className: inputClass,
                }}
                placeholder={"0"}
            />
            {!!helpText && <FormHelperText className={"test-from-error-message"}>{helpText}</FormHelperText>}
        </FormControl>
    );
};
