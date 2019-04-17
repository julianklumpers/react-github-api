import React from 'react';
import ReactDOM from 'react-dom';
import { Overview } from './pages';
import 'bootstrap/scss/bootstrap.scss';
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render((
    <BrowserRouter>
        <Overview />
    </BrowserRouter>
), document.getElementById('root'));
