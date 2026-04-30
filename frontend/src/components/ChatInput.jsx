import React from 'react'

const ChatInput = ({  message, setMessage, sendMessage, sendOffer, socket }) => {
    return (
        <div className="inputArea">

            <div className="messageInputContainer">
                <input
                    type="text"
                    placeholder="Enter your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
                <button onClick={() => socket.emit("next")}>
                    Next Stranger
                </button>
            </div>
        </div>
    )
}

export default ChatInput