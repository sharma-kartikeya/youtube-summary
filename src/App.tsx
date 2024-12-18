import React, { useEffect } from "react";

function App() {
    console.log("ASAFSASDADSAFDSADS")
    useEffect(() => {
        console.log("use Effect Called!")
        chrome.tabs.onActivated.addListener((activeInfo) => {
            console.log("onActivated Called")
            chrome.tabs.get(activeInfo.tabId, (tab) => {
                if (tab.url?.startsWith("https://www.youtube.com/watch?v=")) {
                    // const videoId = getYouTubeVideoId(tab.url);
                    // fetchYouTubeComments(videoId).then((comments) => {
                    //     console.log(comments)
                    //     get_report(comments)
                    // })
                    console.log("youtube video page")
                }
            });
        });

        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            console.log("OnUpdated Called")
            if (changeInfo.status === 'complete' && tab.url) {
                if (tab.url.startsWith("https://www.youtube.com/watch?v=")) {
                    // const videoId = getYouTubeVideoId(tab.url);
                    // fetchYouTubeComments(videoId).then((comments) => {
                    //     console.log(comments)
                    //     get_report(comments)
                    // })
                    console.log("youtube video page")
                }
            }
        });
    }, [])

    return (
        <div className="App">
            Hello World
        </div>
    );
}

export default App;