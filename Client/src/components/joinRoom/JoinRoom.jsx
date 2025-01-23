import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'peerjs';
import { FaMicrophone, FaVideo, FaVideoSlash, FaDesktop, FaPhoneSlash } from 'react-icons/fa';
import { CiMicrophoneOff } from "react-icons/ci";

const JoinRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [peers, setPeers] = useState({});
  const [isCreator, setIsCreator] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef();
  const peersRef = useRef({});
  const socketRef = useRef();
  const myPeer = useRef();
  const myStream = useRef();

  useEffect(() => {
    if (!roomId) return;

    const userId = localStorage.getItem('userId');
    setIsCreator(userId === roomId.split('-')[0]);

    socketRef.current = io('http://localhost:5000');
    myPeer.current = new Peer();
    
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
    
      myStream.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      myPeer.current.on('call', call => {
        call.answer(stream);
        call.on('stream', userVideoStream => {
          addVideoStream(call.peer, userVideoStream);
        });
      });

      socketRef.current.on('user-connected', userId => {
        connectToNewUser(userId, stream);
      });
    });

    myPeer.current.on('open', id => {
      socketRef.current.emit('join-room', roomId, id);
    });

    return () => {
      if (myStream.current) {
        myStream.current.getTracks().forEach(track => track.stop());
      }
      socketRef.current.disconnect();
      Object.values(peersRef.current).forEach(call => call.close());
    };
  }, [roomId]);

  const connectToNewUser = (userId, stream) => {
    const call = myPeer.current.call(userId, stream);
    call.on('stream', userVideoStream => {
      addVideoStream(userId, userVideoStream);
    });
    call.on('close', () => {
      removeVideoStream(userId);
    });
    peersRef.current[userId] = call;
  };

  const addVideoStream = (userId, stream) => {
    setPeers(prev => ({
      ...prev,
      [userId]: stream
    }));
  };

  const removeVideoStream = (userId) => {
    setPeers(prev => {
      const newPeers = { ...prev };
      delete newPeers[userId];
      return newPeers;
    });
  };

  const toggleMute = () => {
    if (myStream.current) {
      myStream.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (myStream.current) {
      myStream.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia();
      if (myStream.current) {
        const videoTrack = screenStream.getVideoTracks()[0];
        Object.values(peersRef.current).forEach(peer => {
          const sender = peer.peerConnection.getSenders().find(s => s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
        videoRef.current.srcObject = screenStream;
        setIsScreenSharing(true);

        videoTrack.onended = () => {
          stopScreenShare();
        };
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const stopScreenShare = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      const videoTrack = stream.getVideoTracks()[0];
      Object.values(peersRef.current).forEach(peer => {
        const sender = peer.peerConnection.getSenders().find(s => s.track.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });
      videoRef.current.srcObject = stream;
      setIsScreenSharing(false);
    });
  };

  const endCall = () => {
    if (isCreator) {
      socketRef.current.emit('end-room', roomId);
    }
    socketRef.current.emit('leave-room', roomId);
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              You {isMuted && '(Muted)'}
            </div>
          </div>
          {Object.entries(peers).map(([userId, stream]) => (
            <div key={userId} className="relative bg-gray-800 rounded-lg overflow-hidden">
              <video
                autoPlay
                playsInline
                ref={element => {
                  if (element) element.srcObject = stream;
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                Participant {userId}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 flex justify-center space-x-4">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'}`}
        >
          {isMuted ? <CiMicrophoneOff className="text-white" /> : <FaMicrophone className="text-white" />}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-600'}`}
        >
          {isVideoOff ? <FaVideoSlash className="text-white" /> : <FaVideo className="text-white" />}
        </button>
        <button
          onClick={shareScreen}
          className={`p-4 rounded-full ${isScreenSharing ? 'bg-green-500' : 'bg-gray-600'}`}
        >
          <FaDesktop className="text-white" />
        </button>
        <button
          onClick={endCall}
          className="p-4 rounded-full bg-red-500"
        >
          <FaPhoneSlash className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;