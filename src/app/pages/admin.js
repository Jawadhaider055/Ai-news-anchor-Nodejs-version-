"use client"
import { useState } from 'react';
import axios from 'axios';

export default function Admin() {
    const [avatarName, setAvatarName] = useState('');
    const [avatarImage, setAvatarImage] = useState(null);
    const [avatarVideo, setAvatarVideo] = useState(null);
    const [message, setMessage] = useState('');

    // Handle avatar form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!avatarName || !avatarImage || !avatarVideo) {
            setMessage('Please fill all fields and upload the required files.');
            return;
        }

        const formData = new FormData();
        formData.append('avatarName', avatarName);
        formData.append('avatarImage', avatarImage);
        formData.append('avatarVideo', avatarVideo);

        try {
            const response = await axios.post('/api/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                setMessage('Avatar uploaded successfully!');
                setAvatarName('');
                setAvatarImage(null);
                setAvatarVideo(null);
            } else {
                setMessage('Failed to upload avatar.');
            }
        } catch (error) {
            setMessage('Error uploading avatar.');
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Admin: Upload New Avatar</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Avatar Name:</label>
                    <input
                        type="text"
                        value={avatarName}
                        onChange={(e) => setAvatarName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Avatar Image (Thumbnail):</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatarImage(e.target.files[0])}
                        required
                    />
                </div>

                <div>
                    <label>Avatar Video:</label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setAvatarVideo(e.target.files[0])}
                        required
                    />
                </div>

                <button type="submit">Upload Avatar</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}
