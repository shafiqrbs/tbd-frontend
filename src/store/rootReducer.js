import { combineReducers } from 'redux'

import utilitySlice from './core/utilitySlice'
import crudSlice from './core/crudSlice'
import coreCrudSlice from './core/crudSlice'
import inventoryCrudSlice from './inventory/crudSlice'
import inventoryUtilitySlice from './inventory/utilitySlice.js'
import accountingUtilitySlice from './accounting/utilitySlice.js'
import utilityUtilitySlice from './utility/utilitySlice.js'
import productionCrudSlice from './production/crudSlice.js'
import productionUtilitySlice from './production/utilitySlice.js'
import nbrCrudSlice from './nbr/crudSlice.js'
import nbrUtilitySlice from './nbr/utilitySlice.js'
import accountingCrudSlice from './accounting/crudSlice.js'
import reportSlice from './report/reportSlice.js'

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        utilitySlice,
        crudSlice,
        coreCrudSlice,
        inventoryCrudSlice,
        accountingCrudSlice,
        inventoryUtilitySlice,
        utilityUtilitySlice,
        accountingUtilitySlice,
        productionCrudSlice,
        productionUtilitySlice,
        nbrCrudSlice,
        nbrUtilitySlice,
        reportSlice,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}

export default rootReducer
