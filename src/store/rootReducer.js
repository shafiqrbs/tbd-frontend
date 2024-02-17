import { combineReducers } from 'redux'

import customerSlice from './core/customerSlice'

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        customerSlice,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}

export default rootReducer
