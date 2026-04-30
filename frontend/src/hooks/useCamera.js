import { useRef, useState, useEffect } from "react";

const useCamera = () => {
    const [localVideoStream, setLocalVideoStream] = useState(null);
    const localVideoRef = useRef(null);

    // Start camera
    const getCamera = async () => {
        try {
            // If already running, reuse it
            if (localVideoStream) {
                console.log("Camera already active");
                return localVideoStream;
            }

            console.log("Requesting camera access...");

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            console.log("Camera access granted");

            // Save stream in state
            setLocalVideoStream(stream);

            // Attach stream to video element
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            return stream;
        } catch (error) {
            console.error("Camera access denied:", error);
            alert("Please allow camera & microphone access");
            throw error;
        }
    };

    //  Stop camera
    const stopCamera = () => {
        if (localVideoStream) {
            console.log("Stopping camera...");

            localVideoStream.getTracks().forEach((track) => {
                track.stop(); // stop video/audio
            });

            setLocalVideoStream(null);

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = null;
            }
        }
    };

    //  Auto cleanup when component unmounts
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return {
        localVideoStream,
        localVideoRef,
        getCamera,
        stopCamera,
    };
};

export default useCamera;