import React, { useEffect, useRef, useState } from 'react'
import { appendMessage, chatStateSelector, Message } from '../../redux/slices/ChatSlice';
import TextInput from '../text-input/TextInput';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import './ChatComponent.css';
import MarkdownComponent from '../markdown/MarkdownComponent';

const ChatComponent: React.FunctionComponent = () => {
    const chatState = useSelector(chatStateSelector);
    const dispatch = useDispatch<AppDispatch>();
    const [inputState, setInputState] = useState<string>();
    const inputRef = useRef<HTMLInputElement>(null);

    const submitMessage = () => {
        if (inputState && inputRef.current && inputRef.current === document.activeElement) {
            dispatch(appendMessage(inputState));
            setInputState(undefined)
        }
    }

    const handler = (ev: KeyboardEvent) => {
        if (ev.key === 'Enter') {
            submitMessage();
        }
    }


    // This will create a flickering issue while inputing. Have to check in future.
    useEffect(() => {
        document.addEventListener('keydown', handler)

        return () => {
            document.removeEventListener('keydown', handler)
        }
    }, [inputState])

    return (
        <div className='chat-container'>
            {chatState.chat.messages.map((message: Message, index: number) => {
                return (
                    <MarkdownComponent
                        key={index}
                        className={`${message.role === 'user' ? 'user-message' : 'assistant-message'} message`}
                        content={message.content}
                    />
                )
            })}
            {chatState.status === 'loading' && <div>Loading...</div>}
            {chatState.status === 'failed' && <div>{chatState.error}</div>}
            <div className='chat-input-bar'>
                <TextInput ref={inputRef} className='chat-input' value={inputState} onChange={(text: string) => {
                    setInputState(text);
                }} />
                <button disabled={inputState === undefined} onClick={() => {
                    if (inputState) {
                        dispatch(appendMessage(inputState));
                        setInputState(undefined)
                    }
                }}>{'>>'}</button>
            </div>
        </div>
    )
}

export default ChatComponent;