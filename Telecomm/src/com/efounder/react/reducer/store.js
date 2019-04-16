import {
	createStore
} from 'redux'
import {
	persistStore,
	persistReducer
} from 'redux-persist'
import storage from 'redux-persist/lib/storage/session' // defaults to localStorage for web and AsyncStorage for react-native

import combineReducers from './reducer.js'

const persistConfig = {
	key: 'root',
	storage,
}

const persistedReducer = persistReducer(persistConfig, combineReducers)

export default () => {
	let store = createStore(persistedReducer)
	let persistor = persistStore(store)
	return {
		store,
		persistor
	}
}