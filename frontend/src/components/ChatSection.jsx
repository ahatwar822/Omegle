import React from 'react'
import ChatHeader from './ChatHeader'
import ChatArea from './ChatArea'
import ChatInput from './ChatInput'

const ChatSection = ({ socketID, allMessage, message, setMessage, sendMessage, sendOffer, socket }) => {
    return (
        <div className="chatSection">

            <ChatHeader socketID={socketID} />

            <ChatArea allMessage={allMessage} />

            <ChatInput
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                sendOffer={sendOffer}
                socket={socket}
            />


        </div>
    )
}

export default ChatSection