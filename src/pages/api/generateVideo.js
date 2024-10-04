const googleTTS = require('google-tts-api');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const https = require('https');

// Set the path to FFmpeg binary
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

function downloadAudio(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filePath);
      reject(err);
    });
  });
}

function changePitchAndSpeed(inputFilePath, outputFilePath, semitones, speed = 1.0) {
  const pitch = 2 ** (semitones / 12);
  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .audioFilters([
        `asetrate=44100*${pitch}`,    // Adjust pitch
        `atempo=${speed}`             // Adjust speed
      ])
      .output(outputFilePath)
      .on('end', () => resolve(outputFilePath))
      .on('error', (err) => reject(err))
      .run();
  });
}

function getMediaDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration);
    });
  });
}

function concatenateVideos(inputPath, outputPath, repeatCount) {
  const inputListPath = path.join(path.dirname(inputPath), 'input_videos.txt');
  
  // Create a file with the list of video inputs
  const videoList = Array(repeatCount).fill(`file '${inputPath}'`).join('\n');
  fs.writeFileSync(inputListPath, videoList);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputListPath)
      .inputOptions(['-f concat', '-safe 0'])
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
}

async function generateVideo(text, avatar, voice) {
  try {
    // Paths setup
    const scriptDir = path.resolve(__dirname);
    const avatarVideoPath = path.resolve(avatar);  // Ensure avatar path is absolute
    const outputAudioPath = path.join(scriptDir, "generated_audio.mp3");
    const outputAdjustedAudioPath = path.join(scriptDir, "adjusted_audio.wav");
    
    // Save final video to the public folder for Next.js access
    const publicFolder = path.join(process.cwd(), 'public');
    const outputVideoPath = path.join(publicFolder, "generated_video.mp4");

    // Check if the avatar video exists
    if (!fs.existsSync(avatarVideoPath)) {
      throw new Error(`Avatar video not found at ${avatarVideoPath}`);
    }

    console.log(`Avatar video path: ${avatarVideoPath}`); // Log the path for debugging

    // Generate TTS audio
    const audioUrl = googleTTS.getAudioUrl(text, { lang: 'en', slow: false });
    await downloadAudio(audioUrl, outputAudioPath);

    // Adjust pitch and speed based on the voice
    if (voice === "Male Voice") {
      await changePitchAndSpeed(outputAudioPath, outputAdjustedAudioPath, -13.5, 1.5); // Male: lower pitch, increase speed
    } else if (voice === "Female Voice") {
      await changePitchAndSpeed(outputAudioPath, outputAdjustedAudioPath, -10, 1.2); // Female: slight pitch increase, normal speed
    } else {
      throw new Error("Unsupported voice selection");
    }

    // Get durations of audio and video
    const audioDuration = await getMediaDuration(outputAdjustedAudioPath);
    const videoDuration = await getMediaDuration(avatarVideoPath);

    // Repeat or trim video based on audio duration
    let finalVideoPath = avatarVideoPath;
    if (audioDuration > videoDuration) {
      // Repeat the video if audio is longer
      const repeatCount = Math.ceil(audioDuration / videoDuration);
      finalVideoPath = await concatenateVideos(avatarVideoPath, outputVideoPath, repeatCount);
    }

    // Combine the video with the adjusted audio
    return new Promise((resolve, reject) => {
      ffmpeg(finalVideoPath)
        .input(outputAdjustedAudioPath)
        .setDuration(audioDuration) // Trim video to audio duration
        .output(outputVideoPath)
        .on('end', () => {
          console.log('Video generated successfully:', outputVideoPath);
          resolve(outputVideoPath);
        })
        .on('error', (err) => reject(err))
        .run();
    });
  } catch (err) {
    console.error('Error generating video:', err);
    throw err;
  }
}

// Call the generateVideo function from the API
async function generateVideoAPI(req, res) {
  const { text, avatar, voice } = req.body;

  try {
    // Generate the video
    const videoPath = await generateVideo(text, avatar, voice);

    // Send the response with the video URL
    res.status(200).json({ videoUrl: '/generated_video.mp4' });
  } catch (err) {
    console.error('Error generating video:', err);
    res.status(500).json({ error: 'Failed to generate video' });
  }
}

export default generateVideoAPI;
