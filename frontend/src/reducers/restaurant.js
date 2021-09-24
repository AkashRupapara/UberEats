const initState = {
    token: '',
    error: '',
};

const restaurantReducer = (state = initState, action) => {
    switch (action.type) {
        case 'RESTAURANT_LOGIN_REQUEST':
            return state;
        case 'RESTAURANT_LOGIN_SUCCESS':
            return { ...state, token: action.payload.data.token };
        case 'RESTAURANT_LOGIN_FAILURE':
            return { ...state, error: action.payload };
        case 'RESTAURANT_REGISTER_REQUEST':
            return state;
        case 'RESTAURANT_REGISTER_SUCCESS':
            return { ...state, token: action.payload.data.token };
        case 'RESTAURANT_REGISTER_FAILURE':
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export default restaurantReducer;