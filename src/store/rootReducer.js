import { combineReducers } from 'redux'

import utilitySlice from './core/utilitySlice'
import crudSlice from './core/crudSlice'

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        utilitySlice,
        crudSlice,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}

export default rootReducer
