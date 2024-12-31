import { Middleware, UnknownAction } from "@reduxjs/toolkit";
import { appendMessage, initiateChat, sendMessage } from "../slices/ChatSlice";


export const chatMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);

    if (appendMessage.match(action) || initiateChat.match(action)) {
        store.dispatch(sendMessage() as unknown as UnknownAction)
    }

    return result;
}