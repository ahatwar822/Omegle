import { useEffect, useState } from 'react'
import { io } from "socket.io-client"


// Socket instance - component ke bahar banao (singleton pattern)
let socketInstance = null

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
const getSocketInstance = () => {
    if (!socketInstance) {
        socketInstance = io(SOCKET_URL, {
            transports: ["websocket"],
            reconnection: true,
        })
    }
    return socketInstance
}

const useSocket = () => {
    const [socketID, setSocketID] = useState("")
    const socket = getSocketInstance()

    useEffect(() => {
        // Connect event listener
        const handleConnect = () => {
            console.log("Connected to server")
            console.log("My socket ID:", socket.id)
            setSocketID(socket.id)

            socket.emit("join");
        }

        socket.on("connect", handleConnect)

        // Cleanup function
        return () => {
            socket.off("connect", handleConnect)
        }
    }, [socket])
    return (
        {
            socket,
            socketID
        }
    )
}

export default useSocket