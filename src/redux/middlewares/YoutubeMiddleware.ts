import { Middleware, UnknownAction } from "@reduxjs/toolkit";
import { appendVideo, fetchYoutubeData } from "../slices/YoutubeSlice";
import { initiateChat } from "../slices/ChatSlice";

export const youtubeMiddleware: Middleware = (store) => (next) => (action) => {
    if (appendVideo.match(action)) {
        console.log('Video Appended!')
        store.dispatch(fetchYoutubeData(action.payload) as unknown as UnknownAction)
    }

    if (fetchYoutubeData.fulfilled.match(action)) {
        let systemPrompt = "Give me detailed report about response of my video based on the comments made by users.";
        console.log("Appending Comments.")
        action.payload.forEach((comment: string) => {
            console.log('Comment to be appended: ' + comment);
            systemPrompt = systemPrompt.concat(`\n<comment>${comment}</comment>`);
            console.log("System Propmt: " + systemPrompt)
        });
        store.dispatch(initiateChat(systemPrompt));
    }
    return next(action);
}