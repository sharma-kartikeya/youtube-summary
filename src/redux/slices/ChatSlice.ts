import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store";

export const sendMessage = createAsyncThunk<string, void>(
    'openAI/chat',
    async (_, thunkApi) => {
        const chatState = (thunkApi.getState() as RootState).chatReducer;
        const url = "https://api.openai.com/v1/chat/completions"
        const apiKey = '*********************************************';
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        }

        const messages = [];
        if (chatState.chat.systemPrompt) {
            messages.push({ 'role': 'system', 'content': chatState.chat.systemPrompt })
        }

        chatState.chat.messages.forEach((message: Message, index: number) => {
            messages.push({ 'role': message.role, 'content': message.content })
        })

        const body = {
            "model": "gpt-4o-mini",
            "messages": messages,
            "temperature": 0.7
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                const errorDetails = await response.json();
                return thunkApi.rejectWithValue(errorDetails);
            }

            const response_body = await response.json()
            if (response_body.choices && response_body.choices[0]) {
                return thunkApi.fulfillWithValue(response_body.choices[0].message.content);
            }
            return thunkApi.rejectWithValue("Response failed")
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.message);
        }
    }
)

export interface Message {
    content: string;
    role: 'user' | 'assistant';
    context?: string;
}

export interface Chat {
    messages: Message[];
    systemPrompt?: string;
}

export interface ChatState {
    chat: Chat;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ChatState = {
    status: 'idle',
    chat: {
        messages: [],
    },
    error: null
}

const chatSlice = createSlice({
    name: 'chatSlice',
    initialState,
    reducers: {
        initiateChat: (state: ChatState, action: PayloadAction<string | undefined>) => {
            state.chat.systemPrompt = action.payload
        },
        appendMessage: (state: ChatState, action: PayloadAction<string>) => {
            state.chat.messages.push({ role: 'user', content: action.payload })
        }
    },
    extraReducers: (builder) => {
        builder.addCase(sendMessage.pending, (state: ChatState, action: PayloadAction) => {
            state.status = 'loading';
        }).addCase(sendMessage.rejected, (state: ChatState, action) => {
            state.status = 'failed';
            state.error = action.payload as string
        }).addCase(sendMessage.fulfilled, (state: ChatState, action) => {
            state.status = 'succeeded';
            const message: Message = {
                role: 'assistant',
                content: action.payload as string
            }
            state.chat.messages.push(message)
        })
    }
});


export const { appendMessage, initiateChat } = chatSlice.actions
export const chatStateSelector = (state: RootState) => state.chatReducer
export default chatSlice.reducer


