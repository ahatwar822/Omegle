import React from 'react'
import LocalVideo from './LocalVideo'
import RemoteVideo from './RemoteVideo'

const VideoSection = ({ localVideoRef, remoteVideoRef, isConnected }) => {
    return (
        <div className="peerConnection">
            <div className="videoSection">
                {!isConnected && (
                    <div className="waitingText">Waiting for peer...</div>
                )}
                <div className="videoContainer">
                    {/* Video implementation will be added here */}
                    <LocalVideo localVideoRef={localVideoRef} />

                    <RemoteVideo remoteVideoRef={remoteVideoRef} />
                    
                </div>
            </div>
        </div>
    )
}

export default VideoSection