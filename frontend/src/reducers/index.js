import { combineReducers } from 'redux'
import customerReducer from './customer'
import restaurantReducer from './restaurant';
import dishReducer from './dish';
import searchFilterReducer from './searchFilter';
import cartReducer from './cart';


export default combineReducers({
    customer: customerReducer,
    restaurant: restaurantReducer,
    dish: dishReducer,
    searchFilter: searchFilterReducer,
    cartItems: cartReducer,
});