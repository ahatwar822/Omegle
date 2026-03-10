import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { io } from "socket.io-client";

const socket = io('http://localhost:3000')
const App = () => {

  const [soketid, setSoketid] = useState('')

  useEffect(() => {
    socket.on('connect', ()=> {
      setSoketid(socket.id)
    })
  },[])
  return (
    <>
      <h1>Socket ID: {soketid}</h1>
    </>
  )
}

export default App