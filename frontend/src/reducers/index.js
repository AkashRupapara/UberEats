import { combineReducers } from 'redux'
import customerReducer from './customer'
import restaurantReducer from './restaurant';
import dishReducer from './dish';


export default combineReducers({
    customer: customerReducer,
    restaurant: restaurantReducer,
    dish: dishReducer,
});