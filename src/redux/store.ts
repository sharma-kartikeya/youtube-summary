import { configureStore } from "@reduxjs/toolkit";
import YoutubeReducer from "./slices/YoutubeSlice";
import ChatReducer from "./slices/ChatSlice";
import { chatMiddleware } from "./middlewares/ChatMiddleware";
import { youtubeMiddleware } from "./middlewares/YoutubeMiddleware";

const store = configureStore({
  reducer: {
    youtubeReducer: YoutubeReducer,
    chatReducer: ChatReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(chatMiddleware).concat(youtubeMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export default store;