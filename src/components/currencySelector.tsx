import {MenuItem} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import cn from "classnames";
import * as React from "react";
import {ChangeEvent} from "react";
import {format} from "../data/currency";
import {Pocket} from "../data/pocket";

type Props = {
    value: string,
    label: string,
    onChange: (e: ChangeEvent<HTMLSelectElement>) => any,
    pocket: Pocket,
    pockets: Pocket[],
    inputClassName?: string,
    balanceClassName?: string,
};

const useStyles = makeStyles(() => ({
    balanceAdornmentPositioning: {
        position: "absolute",
        right: 0,
        marginRight: 30,
        whiteSpace: "nowrap",
    },
    lightFont: {
        fontWeight: 200,
    },
    input: {
        "&:focus": {
            backgroundColor: "#FFFFFF",
        },
    },
}));

export const CurrencySelector = (props: Props) => {
    const {value, onChange, pocket, pockets, label, inputClassName, balanceClassName} = props;
    const classes = useStyles();

    return (
        <TextField
            select
            fullWidth
            label={label}
            value={value}
            onChange={onChange}
            className={inputClassName}
            SelectProps={{fullWidth: true}}
            InputProps={{
                className: cn(classes.lightFont),
                classes: {input: classes.input},
                endAdornment: (
                    <InputAdornment
                        disablePointerEvents
                        className={cn(classes.balanceAdornmentPositioning)}
                        position="end"
                    >
                        <span className={balanceClassName}>{format(pocket.balance, pocket.currency)}</span>
                    </InputAdornment>
                ),
            }}>
            {pockets.map((currentPocket) => (
                <MenuItem key={currentPocket.id} value={currentPocket.id}>
                    {currentPocket.currency}
                </MenuItem>
            ))}
        </TextField>
    );
};
