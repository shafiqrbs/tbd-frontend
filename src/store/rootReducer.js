import { combineReducers } from 'redux'

import userReducer from './user/userSlice'

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        userReducer,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}

export default rootReducer
