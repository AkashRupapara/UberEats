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
