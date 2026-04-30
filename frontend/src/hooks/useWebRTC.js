import { useRef, useEffect, useState } from "react";

const useWebRTC = (socket, localVideoStream, getCamera) => {
    const pc = useRef(null);
    const remoteRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const iceQueue = useRef([]);

    const [isConnected, setIsConnected] = useState(false);
    const [partnerId, setPartnerId] = useState(null);

    //  ALWAYS create fresh PeerConnection
    const createPeerConnection = () => {
        if (pc.current) {
            pc.current.close();
            pc.current = null;
        }

        console.log("Creating NEW peer connection...");

        pc.current = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                {
                    urls: "turn:relay.metered.ca:80",
                    username: "openai",
                    credential: "openai"
                }
            ]
        });

        // ICE
        pc.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", {
                    targetId: remoteRef.current,
                    candidate: event.candidate
                });
            }
        };

        // Remote stream
        pc.current.ontrack = (event) => {
            console.log("Remote stream received");

            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
                setIsConnected(true);
            }
        };

        pc.current.onconnectionstatechange = () => {
            console.log("Connection state:", pc.current.connectionState);
        };
    };

    //  SAFE TRACK ADDING
    const addTracks = (stream) => {
        const senders = pc.current.getSenders();

        if (senders.length === 0) {
            stream.getTracks().forEach(track => {
                pc.current.addTrack(track, stream);
            });
        }
    };

    //  SEND OFFER
    const sendOffer = async (targetId) => {
        try {
            console.log("Sending offer to:", targetId);
            remoteRef.current = targetId;

            let stream = localVideoStream;
            if (!stream) {
                stream = await getCamera();
            }

            createPeerConnection();
            addTracks(stream);

            const offer = await pc.current.createOffer();
            await pc.current.setLocalDescription(offer);

            socket.emit("offer", {
                targetId,
                offer
            });

        } catch (err) {
            console.error("Offer error:", err);
        }
    };

    useEffect(() => {
        if (!socket) return;

        //  OFFER HANDLER
        const handleOffer = async (data) => {
            try {
                console.log("Offer received from:", data.sender);

                remoteRef.current = data.sender;

                let stream = localVideoStream;
                if (!stream) {
                    stream = await getCamera();
                }

                createPeerConnection();
                addTracks(stream);

                await pc.current.setRemoteDescription(data.offer);

                // flush ICE
                for (let candidate of iceQueue.current) {
                    await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
                iceQueue.current = [];

                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);

                socket.emit("answer", {
                    targetId: data.sender,
                    answer
                });

            } catch (err) {
                console.error("Offer handling error:", err);
            }
        };

        //  ANSWER HANDLER
        const handleAnswer = async (data) => {
            try {
                console.log("Answer received from:", data.sender);

                await pc.current.setRemoteDescription(data.answer);

                for (let candidate of iceQueue.current) {
                    await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
                iceQueue.current = [];

            } catch (err) {
                console.error("Answer error:", err);
            }
        };

        //  ICE HANDLER
        const handleIceCandidate = async (data) => {
            try {
                if (!pc.current) return;

                if (pc.current.remoteDescription) {
                    await pc.current.addIceCandidate(
                        new RTCIceCandidate(data.candidate)
                    );
                } else {
                    iceQueue.current.push(data.candidate);
                }

            } catch (err) {
                console.error("ICE error:", err);
            }
        };

        //  MATCHED
        const handleMatched = (data) => {
            console.log("Matched with:", data.partnerId);

            setPartnerId(data.partnerId);
            setIsConnected(false);
            iceQueue.current = [];

            sendOffer(data.partnerId);
        };

        // DISCONNECT
        const handleDisconnect = () => {
            console.log("Partner disconnected");

            setPartnerId(null);
            setIsConnected(false);
            iceQueue.current = [];

            if (pc.current) {
                pc.current.close();
                pc.current = null;
            }
        };

        // Register
        socket.on("offer", handleOffer);
        socket.on("answer", handleAnswer);
        socket.on("ice-candidate", handleIceCandidate);
        socket.on("matched", handleMatched);
        socket.on("partner-disconnected", handleDisconnect);

        // Cleanup
        return () => {
            socket.off("offer", handleOffer);
            socket.off("answer", handleAnswer);
            socket.off("ice-candidate", handleIceCandidate);
            socket.off("matched", handleMatched);
            socket.off("partner-disconnected", handleDisconnect);
        };

    }, [socket, localVideoStream, getCamera]);

    return {
        remoteVideoRef,
        sendOffer,
        isConnected
    };
};

export default useWebRTC;