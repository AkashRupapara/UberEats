export function loginCustomerRequest() {
    return {
        type: 'CUSTOMER_LOGIN_REQUEST',
    };
}

export function loginCustomerSuccess(payload) {
    return {
        type: 'CUSTOMER_LOGIN_SUCCESS', payload
    };
}

export function loginCustomerFailure(payload) {
    return {
        type: 'CUSTOMER_LOGIN_FAILURE', payload
    };
}

export function registerCustomerRequest() {
    return {
        type: 'CUSTOMER_REGISTER_REQUEST',
    };
}

export function registerCustomerSuccess(payload) {
    return {
        type: 'CUSTOMER_REGISTER_SUCCESS', payload
    };
}

export function registerCustomerFailure(payload) {
    return {
        type: 'CUSTOMER_REGISTER_FAILURE', payload
    };
}
