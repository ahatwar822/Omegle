import React from 'react'

const ChatHeader = ({socketID}) => {
  return (
    <div className="userHeader">{socketID}</div>
  )
}

export default ChatHeader