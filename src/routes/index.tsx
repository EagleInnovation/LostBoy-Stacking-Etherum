import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from '../screens/Dashboard/Dashboard';

const AppMain: React.FC<{}> = () => {
    return (
        <>
            <Suspense fallback={<span>loading</span>}>
                <Switch>
                    <Route exact path="/" component={Dashboard} />
                </Switch>
            </Suspense>
        </>
    );
};

export default AppMain;
