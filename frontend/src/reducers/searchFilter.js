import { SET_LOCATION } from "../actions/types";

const initState = {
    location: ""
};

const searchFilterReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_LOCATION:
            return { ...state, location: action.payload};
        default:
            return state;
    }
};

export default searchFilterReducer;