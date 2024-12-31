import React, { useEffect } from "react";
import './App.css';
import TextInput from "./components/text-input/TextInput";
import { useDispatch, useSelector } from "react-redux";
import { appendVideo, YoutubeStateSelector, YoutubeVideoData } from "./redux/slices/YoutubeSlice";
import { AppDispatch, RootState } from "./redux/store";
import ChatComponent from "./components/chat-component/ChatComponent";

function App() {
    const youtubeState = useSelector<RootState, YoutubeVideoData>(YoutubeStateSelector);
    const dispatcher = useDispatch<AppDispatch>();

    const getVideoId = (url: string): string | undefined => {
        if (url.startsWith("https://www.youtube.com/watch?v=")) {
            const urlObj = new URL(url);

            // Check for standard YouTube URL
            if (urlObj.searchParams.has("v")) {
                return urlObj.searchParams.get("v") || undefined;
            }
        }
    }

    return <div className="App">
        {
            youtubeState.status === 'idle' ? (
                // <ChatComponent />
                <div>
                    <div className="header">Enter Youtube URL</div>
                    <TextInput
                        className="url-input"
                        validationError="Please enter valid Youtube video url."
                        validation={(value: string) => {
                            const videoId = getVideoId(value);
                            if (videoId) {
                                dispatcher(appendVideo(videoId));
                                return true;
                            } else return false;
                        }}
                    />
                </div>
            ) : youtubeState.status === 'failed' ? (
                <div className="App">{youtubeState.error}</div>
            ) : youtubeState.status === 'loading' ? (
                <div>Fetching Youtube Data.....</div>
            ) : (
                <ChatComponent />
            )
        }
    </div>
}

export default App;