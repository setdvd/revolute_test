import * as React from "react";
import {connect} from "react-redux";
import {subscribeToFX, unsubscribeFromFX} from "../actions";
import * as State from "../reducer";

type TActions = {
    subscribeToFX: () => any,
    unsubscribeFromFX: () => any,
};

type Props = {
    children: any,
} & TActions;

class FXPollerInternal extends React.PureComponent<Props> {
    public componentDidMount(): void {
        this.props.subscribeToFX();
    }

    public componentWillUnmount(): void {
        this.props.unsubscribeFromFX();
    }

    public render() {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }

}

export const FXPoller = connect<{}, TActions, {}, State.State>(
    null,
    {
        unsubscribeFromFX,
        subscribeToFX,
    })(FXPollerInternal);
