import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider as MUIThemeProvider} from "@material-ui/styles";
import * as React from "react";

const theme = createMuiTheme({
    palette: {
        primary: {main: "rgb(0, 117, 235)"},
        secondary: {main: "rgb(235, 0, 141)"},
    },
});

export const ThemeProvider = ({children}: any) => (
    <MUIThemeProvider theme={theme}>
        {children}
    </MUIThemeProvider>
);
