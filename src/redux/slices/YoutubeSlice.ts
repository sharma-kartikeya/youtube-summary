import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface YoutubeVideoData {
    videoId?: string;
    comments: string[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: YoutubeVideoData = {
    videoId: "",
    comments: [],
    status: 'idle',
    error: null,
}

// Async thunk to fetch data
export const fetchYoutubeData = createAsyncThunk<string[], string>(
    'youtubeSlice/fetchData',
    async (videoId, thunkAPI) => {
        try {
            let nextPageToken = ''
            const comments: string[] = []
            do {
                const apiKey = "**********************************";
                const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}&maxResults=100&pageToken=${nextPageToken}`;
                const response = await fetch(url);
                const data = await response.json();
                data.items.forEach((item: any) => {
                    comments.push(item.snippet.topLevelComment.snippet.textDisplay)
                });
                nextPageToken = data.nextPageToken || '';
            } while (nextPageToken !== '');
            return thunkAPI.fulfillWithValue(comments);

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const youtubeSlice = createSlice({
    name: 'youtube',
    initialState,
    reducers: {
        appendVideo: (state: YoutubeVideoData, action: PayloadAction<string>) => {
            state.videoId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchYoutubeData.pending, (state: YoutubeVideoData) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchYoutubeData.fulfilled, (state: YoutubeVideoData, action: PayloadAction<string[]>) => {
                state.status = 'succeeded';
                state.comments = action.payload; // Store fetched data in the state
            })
            .addCase(fetchYoutubeData.rejected, (state: YoutubeVideoData, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { appendVideo } = youtubeSlice.actions; // Export actions
export const YoutubeStateSelector = (state: RootState) => state.youtubeReducer
export default youtubeSlice.reducer; // Export reducer
