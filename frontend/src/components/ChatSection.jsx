import React from 'react'
import ChatHeader from './ChatHeader'
import ChatArea from './ChatArea'
import ChatInput from './ChatInput'

const ChatSection = ({ socketID, allMessage, targetId, setTargetId, message, setMessage, sendMessage, sendOffer }) => {
    return (
        <div className="chatSection">

            <ChatHeader socketID={socketID} />

            <ChatArea allMessage={allMessage} />

            <ChatInput
                targetId={targetId}
                setTargetId={setTargetId}
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                sendOffer={sendOffer}
            />


        </div>
    )
}

export default ChatSection