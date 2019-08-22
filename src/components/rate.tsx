import {FormControl} from "@material-ui/core";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

type Props = {
    rate: string,
};

export const Rate = ({rate}: Props) => {
    return (
        <FormControl>
            <FormLabel>Current rate</FormLabel>
            <Typography className={"test-one-unit-conversion"}>{rate}</Typography>
        </FormControl>
    );
};
