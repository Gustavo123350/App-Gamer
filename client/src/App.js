import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client'; 
function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    
    useEffect(() => {
        const socket = io('http://localhost:5000');
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        return () => {
            socket.disconnect();
        };
    }, []);
    
    const handleSendMessage = () => {
        if (input.trim() !== '') {
            const message = {
                text: input, 
                user: 'Usuario(a)',
            };

            setMessages([...messages, message]);
            setInput('');

            io('http://localhost:5000').emit('message', message);
        }
    };

    const WebcamComponent = () => {
        const videoRef = useRef(null);

        const handleStartWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error ao iniciar a webcam:', error);
            }
        };

        return (
            <div className='container-flex'>
                <button className='botao2' onClick={handleStartWebcam}><i class="bi bi-webcam"></i></button>
                <video ref={videoRef} autoPlay playsInline style={{ display: 'block', maxWidth: '100%' }} />
            </div>
        );
    };

    return (
        <div>
            <div>
                {messages.map((message, index) => (
                    <p className="user" key={index}>
                        <strong>{message.user}:</strong> {message.text}
                    </p>
                ))}
            </div>
            <div className='container-flex'>
                <input
                    
                    placeholder='Digite sua mensagem...'
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <button  className='botao'  onClick={handleSendMessage}><i class="bi bi-box-arrow-in-right"></i></button>
                <WebcamComponent />
            </div>
        </div>
    );
}
export default App;
