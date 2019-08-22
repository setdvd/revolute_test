import {Fab, makeStyles} from "@material-ui/core";
import cn from "classnames";
import * as React from "react";

type Props = {
    className: string,
    onClick: () => any,
    disabled: boolean,
};

const useStyles = makeStyles(() => ({
    extendedPadding: {
        padding: "0 2rem",
        width: "100%",
    },
}));

export const ExchangeButton = (props: Props) => {
    const classes = useStyles();
    return (
        <Fab {...props}
             className={cn(classes.extendedPadding, props.className)}
             color={"secondary"}
             variant={"extended"}>
            Exchange
        </Fab>
    );
};
