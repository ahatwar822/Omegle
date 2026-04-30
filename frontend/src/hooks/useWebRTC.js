import { useRef, useEffect, useState } from "react"

const useWebRTC = (socket, localVideoStream, getCamera) => {
    const pc = useRef(null)
    const remoteRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const iceQueue = useRef([])

    const [isConnected, setIsConnected] = useState(false);

    // ✅ Create Peer Connection (only once)
    const connectPC = () => {
        if (pc.current) return

        console.log("Creating peer connection...")

        pc.current = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                {
                    urls: "turn:relay.metered.ca:80",
                    username: "openai",
                    credential: "openai"
                }
            ]
        })

        // ✅ Send ICE candidates
        pc.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", {
                    targetId: remoteRef.current,
                    candidate: event.candidate
                })
            }
        }

        // ✅ Receive remote stream
        pc.current.ontrack = (event) => {
            console.log("Remote stream received");

            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
                setIsConnected(true); // ✅ IMPORTANT
            }
        };

        // Debug (optional)
        pc.current.onconnectionstatechange = () => {
            console.log("Connection state:", pc.current.connectionState)
        }
    }

    // ✅ SEND OFFER
    const sendOffer = async (targetId) => {
        try {
            console.log("Sending offer to:", targetId)
            remoteRef.current = targetId

            let stream = localVideoStream
            if (!stream) {
                stream = await getCamera()
            }

            connectPC()

            // Add tracks
            stream.getTracks().forEach(track => {
                pc.current.addTrack(track, stream)
            })

            const offer = await pc.current.createOffer()
            await pc.current.setLocalDescription(offer)

            socket.emit("offer", {
                targetId,
                offer
            })

        } catch (err) {
            console.error("Offer error:", err)
        }
    }

    useEffect(() => {
        if (!socket) return

        // ✅ HANDLE OFFER (receiver side)
        const handleOffer = async (data) => {
            try {
                console.log("Offer received from:", data.sender)

                remoteRef.current = data.sender

                let stream = localVideoStream
                if (!stream) {
                    stream = await getCamera()
                }

                connectPC()

                // Add tracks
                stream.getTracks().forEach(track => {
                    pc.current.addTrack(track, stream)
                })

                // IMPORTANT: set remote description first
                await pc.current.setRemoteDescription(data.offer)

                // Flush queued ICE candidates
                for (let candidate of iceQueue.current) {
                    await pc.current.addIceCandidate(new RTCIceCandidate(candidate))
                }
                iceQueue.current = []

                const answer = await pc.current.createAnswer()
                await pc.current.setLocalDescription(answer)

                socket.emit("answer", {
                    targetId: data.sender,
                    answer
                })

            } catch (err) {
                console.error("Offer handling error:", err)
            }
        }

        // ✅ HANDLE ANSWER (caller side)
        const handleAnswer = async (data) => {
            try {
                console.log("Answer received from:", data.sender)

                await pc.current.setRemoteDescription(data.answer)

                // Flush ICE queue
                for (let candidate of iceQueue.current) {
                    await pc.current.addIceCandidate(new RTCIceCandidate(candidate))
                }
                iceQueue.current = []

            } catch (err) {
                console.error("Answer error:", err)
            }
        }

        // ✅ HANDLE ICE
        const handleIceCandidate = async (data) => {
            try {
                if (!pc.current) return

                if (pc.current.remoteDescription) {
                    await pc.current.addIceCandidate(
                        new RTCIceCandidate(data.candidate)
                    )
                } else {
                    // Store until remoteDescription is set
                    iceQueue.current.push(data.candidate)
                }

            } catch (err) {
                console.error("ICE error:", err)
            }
        }

        // Register listeners
        socket.on("offer", handleOffer)
        socket.on("answer", handleAnswer)
        socket.on("ice-candidate", handleIceCandidate)

        return () => {
            socket.off("offer", handleOffer)
            socket.off("answer", handleAnswer)
            socket.off("ice-candidate", handleIceCandidate)
        }

    }, [socket, localVideoStream, getCamera])

    return {
        remoteVideoRef,
        sendOffer,
        isConnected
    }
}

export default useWebRTC