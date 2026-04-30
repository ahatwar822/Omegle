
import './App.css'
import ChatSection from './components/ChatSection';
import VideoSection from './components/VideoSection';
import useCamera from './hooks/useCamera';
import useChat from './hooks/useChat';
import useSocket from './hooks/useSocket';
import useWebRTC from './hooks/useWebRTC';


const App = () => {

  const { socketID, socket } = useSocket();
  const { allMessage, targetId, setTargetId, message, setMessage, sendMessage } = useChat(socket);
  const { localVideoRef, localVideoStream, getCamera } = useCamera();
  const { remoteVideoRef, sendOffer, isConnected } = useWebRTC(socket, localVideoStream, getCamera);

  // Offer send karne ka wrapper function
  const handleSendOffer = () => {
    if (targetId) {
      sendOffer(targetId)
    } else {
      alert("Please enter target ID first")
    }
  }

  return (
    <>
      <div className="outer">
        <ChatSection
          socketID={socketID}
          allMessage={allMessage}
          targetId={targetId}
          setTargetId={setTargetId}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          sendOffer={handleSendOffer}
        />
        <VideoSection
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          isConnected={isConnected}
        />
      </div>
    </>
  )
}

export default App