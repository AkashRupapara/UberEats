export function loginRestaurantRequest() {
    return {
        type: 'RESTAURANT_LOGIN_REQUEST',
    };
}

export function loginRestaurantSuccess(payload) {
    return {
        type: 'RESTAURANT_LOGIN_SUCCESS', payload
    };
}

export function loginRestaurantFailure(payload) {
    return {
        type: 'RESTAURANT_LOGIN_FAILURE', payload
    };
}

export function registerRestaurantRequest() {
    return {
        type: 'RESTAURANT_REGISTER_REQUEST',
    };
}

export function registerRestaurantSuccess(payload) {
    return {
        type: 'RESTAURANT_REGISTER_SUCCESS', payload
    };
}

export function registerRestaurantFailure(payload) {
    return {
        type: 'RESTAURANT_REGISTER_FAILURE', payload
    };
}
