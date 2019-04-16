import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill'
import { createStore } from 'redux'
import {Provider} from 'react-redux';
import { browserHistory } from 'react-router';
import Routes from './com/efounder/react/router/routes.jsx';
import reducer from './com/efounder/react/reducer/reducer.js';
import storeConfig from './com/efounder/react/reducer/store.js';
const { persistor, store } = storeConfig()

import { PersistGate } from 'redux-persist/integration/react'
ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
        	<Routes history={browserHistory}/>
        </PersistGate>
    </Provider>,
    
    document.getElementById('root')
);