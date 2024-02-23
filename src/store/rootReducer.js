import { combineReducers } from 'redux'

import customerSlice from './core/customerSlice'
import utilitySlice from './core/utilitySlice'
import crudSlice from './core/crudSlice'

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        customerSlice,
        utilitySlice,
        crudSlice,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}

export default rootReducer
