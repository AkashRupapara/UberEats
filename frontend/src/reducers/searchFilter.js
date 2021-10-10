import { SET_DELIVERY_TYPE, SET_DISH_TYPE, SET_LOCATION } from "../actions/types";

const initState = {
    location: null,
    deliveryType: null,
    dishType: null,
};

const searchFilterReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_LOCATION:
            return { ...state, location: action.payload};
        case SET_DELIVERY_TYPE:
            return { ...state, deliveryType: action.payload};
        case SET_DISH_TYPE:
            return { ...state, dishType: action.payload};
        default:
            return state;
    }
};

export default searchFilterReducer;