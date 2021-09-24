const initState = {
    token: '',
    error: '',
};

const customerReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CUSTOMER_LOGIN_REQUEST':
            return state;
        case 'CUSTOMER_LOGIN_SUCCESS':
            return { ...state, token: action.payload.data.token };
        case 'CUSTOMER_LOGIN_FAILURE':
            return { ...state, error: action.payload };
        case 'CUSTOMER_REGISTER_REQUEST':
            return state;
        case 'CUSTOMER_REGISTER_SUCCESS':
            return { ...state, token: action.payload.data.token };
        case 'CUSTOMER_REGISTER_FAILURE':
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export default customerReducer;