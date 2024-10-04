import { spawn } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { text, language } = req.body;

    // Define the path to the Python script
    const pythonScript = path.resolve('python-scripts/generate_mp3.py');
    console.log('Executing Python script at:', pythonScript);

    // Spawn the Python process
    const pythonProcess = spawn('python', [pythonScript, text, language]);

    // Capture stdout data
    pythonProcess.stdout.on('data', (data) => {
      const mp3FilePath = data.toString().trim();
      console.log('MP3 file generated:', mp3FilePath);
      res.status(200).json({ filename: mp3FilePath });  // Send the response here
    });

    // Capture stderr data (Python script errors)
    pythonProcess.stderr.on('data', (data) => {
      console.error('Error from Python script:', data.toString());
      res.status(500).json({ error: data.toString() });  // Send the response here
    });

    // Check if the process exits successfully
    pythonProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        res.status(500).json({ error: `Python process exited with code ${code}` });  // Send the response here
      }
    });

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
