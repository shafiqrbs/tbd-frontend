import { combineReducers } from 'redux'

import utilitySlice from './core/utilitySlice'
import crudSlice from './core/crudSlice'
import inventoryCrudSlice from './inventory/crudSlice'
import inventoryUtilitySlice from './inventory/utilitySlice.js'
import accountingUtilitySlice from './accounting/utilitySlice.js'
import utilityUtilitySlice from './utility/utilitySlice.js'
import productionCrudSlice from './production/crudSlice.js'
import productionUtilitySlice from './production/utilitySlice.js'

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        utilitySlice,
        crudSlice,
        inventoryCrudSlice,
        inventoryUtilitySlice,
        utilityUtilitySlice,
        accountingUtilitySlice,
        productionCrudSlice,
        productionUtilitySlice,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}

export default rootReducer
