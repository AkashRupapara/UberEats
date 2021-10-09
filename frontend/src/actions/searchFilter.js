import { SET_LOCATION } from "./types";

export function setLocation(payload) {
    return {
        type: SET_LOCATION, payload
    };
}