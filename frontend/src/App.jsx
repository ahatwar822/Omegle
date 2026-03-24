import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { io } from "socket.io-client";

//use app.css
import './App.css'

const socket = io('http://localhost:3000')
const App = () => {

  const [socketId, setSocketId] = useState('')

  const [targetId, setTargetId] = useState("")
  const [message, setMessage] = useState("")
  const [allMessage, setAllMessage] = useState([])

  const localVideo = useRef(null)
  const localStream = useRef(null)

  const pc = useRef(null)

  const connectPC = () => {
    pc.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302"
        }
      ]
    });
    
  }

  const sendOffer = async () => {
    connectPC();
    const offer = pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    console.log("offer created !!")
    socket.emit("offer", {
      targetId: targetId,
      message: offer
    })
  }

  const sendMessage = () => {
    console.log("ruk ja bhej raha hu")

    if (message.trim()) {
      setAllMessage((prev) => [...prev, {
        targetId,
        message,
        isOwn: true
      }])
      socket.emit("sender", {
        targetId: targetId,
        message: message
      })
    }
  }

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id)
    });
    socket.on("receiver", (receiverData) => {
      setAllMessage((prev) => [...prev, {
        receiverData,
        isOwn: false
      }])
    });
   
   socket.on('offer', async(data) => {
    connectPC();
    
    await pc.current.setRemoteDescription(data.offer);
    console.log('answer created');

    const answer = await pc.current.createAnswer()
    await pc.current.setLocalDescription(answer)

    socket.emit('answer', {
      targetId: targetId,
      answer: answer
    })
    
   })

   socket.on('answer', async(data) => {
    await pc.current.setRemoteDescription(data.answer)
   })

   const getCamera = async () => {
    // try {
    //   const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    //   localVideo.current.srcObject = stream;
    //   localStream.current = stream;

    //   stream.getTracks().forEach((track) => {
    //     pc.current.addTrack(track, stream);
    //   })
    // } catch (error) {
    //   console.error('Error accessing media devices:', error);
    // }
   }

  //  getCamera();

  }, [])
  return (
    <>
      <div className="outer">
        <div className="chatSection">
          <div className="userHeader">{socketId}</div>
          <div className="chatArea">
            {
              allMessage.map((msg, index) => (
                <div key={index} className={msg.isOwn ? "message own" : "message other"}>
                  <div className="messageSender">{msg.isOwn ? "You" : msg.receiverData?.sender || "User"}</div>
                  <div className="messageContent">{msg.message || msg.receiverData?.message}</div>
                </div>
              ))
            }
          </div>

          <div className="inputArea">
            <input type="text" placeholder="Enter target ID" value={targetId} onChange={(e) => setTargetId(e.target.value)} />
            <div className="messageInputContainer">
              <input type="text" placeholder="Enter your message" value={message} onChange={(e) => setMessage(e.target.value)} />
              <button onClick={sendMessage}>Send</button>
              <button onClick={sendOffer}>Send Offer</button>
            </div>

          </div>

          {/* chat section end */}
        </div>
        <div className="peerConnection">
          <div className="videoSection">
            <h3>Video Connection</h3>
            <div className="videoContainer">
              {/* Video implementation will be added here */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App