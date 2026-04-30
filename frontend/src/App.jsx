
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


  return (
    <>
      <div className="outer">
        <ChatSection
          socketID={socketID}
          allMessage={allMessage}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          sendOffer={sendOffer}
          socket={socket}
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