import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/scss/bootstrap.scss';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

const Overview = lazy(() => import('./pages/Overview'));
const Show = lazy(() => import('./pages/Show'));

ReactDOM.render((
    <BrowserRouter>
        <Suspense fallback='Loading...'>
            <Switch>
                <Route exact path="/" component={Overview} />
                <Route exact path="/users" component={Overview} />
                <Route exact path="/users/:user" component={Show} />
            </Switch>
        </Suspense>
    </BrowserRouter>
), document.getElementById('root'));
