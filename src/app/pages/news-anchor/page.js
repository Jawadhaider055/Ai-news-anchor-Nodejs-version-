"use client";
import { useState } from 'react';
import axios from 'axios';

export default function NewsAnchor() {
  const [text, setText] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [voice, setVoice] = useState('Male Voice');
  const [loading, setLoading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State to control success popup visibility

  const videoOptions = [
    { id: 'boy', title: 'Boy Avatar', src: '/boy.mp4', poster: '/boy.png' },
    { id: 'female', title: 'Female Avatar', src: '/female.mp4', poster: '/female.png' },
    { id: 'boy2', title: 'Boy Avatar 2', src: '/boy2.mp4', poster: '/boy2.png' },
    { id: 'female2', title: 'Female Avatar 2', src: '/female2.mp4', poster: '/female2.png' }
  ];

  const videoPaths = {
    boy: 'C:\\Users\\PMLS\\Desktop\\news anchor\\news-anchor\\public\\boy.mp4',
    female: 'C:\\Users\\PMLS\\Desktop\\news anchor\\news-anchor\\public\\female.mp4',
    boy2: 'C:\\Users\\PMLS\\Desktop\\news anchor\\news-anchor\\public\\boy2.mp4',
    female2: 'C:\\Users\\PMLS\\Desktop\\news anchor\\news-anchor\\public\\female2.mp4'
  };

  const generateVideo = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate a video.');
      return;
    }

    if (!selectedAvatar) {
      alert('Please select an avatar video to generate the video.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/generateVideo', {
        text: text,
        avatar: videoPaths[selectedAvatar.id],
        voice: voice,
      });

      if (response.data.videoUrl) {
        setGeneratedVideoUrl(response.data.videoUrl);
        setShowSuccessPopup(true); // Show success popup when video is generated
      }
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Error generating video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 flex flex-col items-center p-8">
      <h1 className="w-full text-4xl font-bold text-center text-white mb-4">
        Generate Your News Presentation
      </h1>

      {/* Wrapper for Header and Button */}
      <div className="mb-6 flex flex-col items-center w-full">
        {/* Header for Voice Options */}
        <div className="flex justify-center space-x-4 p-2 rounded-lg border border-gray-200 bg-gray-100 w-full">
          <label className="font-medium text-gray-700">Select Voice:</label>
          {['Male Voice', 'Female Voice'].map((voiceOption) => (
            <button
              key={voiceOption}
              onClick={() => setVoice(voiceOption)}
              className={`px-4 py-2 rounded-lg border border-gray-300 transition-colors ${
                voice === voiceOption ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
              } hover:bg-blue-500 hover:text-white`}
            >
              {voiceOption}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex w-full max-w-6xl space-x-6">
        {/* Text Area Section */}
        <div className="flex-1 p-4 rounded-lg shadow border border-gray-200 h-[300px] bg-white">
          <textarea
            className="w-full h-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the news script here..."
          />
        </div>

        {/* Avatar Selection Section */}
        <div className="flex-1 p-4 rounded-lg shadow border border-gray-200 bg-white">
          <h2 className="text-2xl font-semibold mb-4">Select an Avatar</h2>
          <div className="flex space-x-4 overflow-x-auto">
            {videoOptions.map((video) => (
              <div 
                key={video.id} 
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedAvatar(video)}
              >
                <div className={`w-20 h-20 rounded-full border-2 ${selectedAvatar?.id === video.id ? 'border-blue-500' : 'border-transparent'} overflow-hidden mb-1`}>
                  <img src={video.poster} alt={video.title} className="w-full h-full object-cover" />
                </div>
                <p className="text-center text-gray-700">{video.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Play Video Button */}
      <button
        onClick={generateVideo}
        disabled={loading}
        className={`mt-6 w-16 h-16 rounded-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="w-8 h-8"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      {/* Modal with Loading Animation */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-12 w-[400px] h-[400px] rounded-lg shadow-lg flex flex-col items-center justify-center">
            {/* Cube Animation */}
            <div className="cssload-thecube">
              <div className="cssload-cube cssload-c1"></div>
              <div className="cssload-cube cssload-c2"></div>
              <div className="cssload-cube cssload-c4"></div>
              <div className="cssload-cube cssload-c3"></div>
            </div>
            <p className="text-gray-900 mt-4 text-xl font-bold">Generating Video...</p>
          </div>
        </div>
      )}

      {/* Success Notification with Image and OK Button */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-12 w-[400px] h-[400px] rounded-lg shadow-lg flex flex-col items-center justify-center">
            <img
              src="/done.png"
              alt="Video Generated"
              className="w-20 h-20 animate-bounce"
            />
            <p className="text-gray-900 mt-4 text-xl font-bold">Video Generated Successfully</p>
            <button
              onClick={() => setShowSuccessPopup(false)} // Close the popup on click
              className="mt-6 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {generatedVideoUrl && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Generated Video</h2>
          <video width="350" height="200" controls className="w-full mb-4">
            <source src={generatedVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <a href={generatedVideoUrl} download="generated_video.mp4" className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Download Video
          </a>
        </div>
      )}
    </div>
  );
}
