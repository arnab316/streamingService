import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//* Video transcoding function
export const transcodeVideo = (inputPath, outputDir) => {
  const outputFilePath = path.join(outputDir, 'output.m3u8');

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputFilePath)
      .addOptions([
        '-codec: copy',        // Copy codec to keep original quality
        '-start_number 0',     // Start segment number
        '-hls_time 10',        // Segment duration
        '-hls_list_size 0',    // Ensure all segments are listed
        '-f hls',               // Output format: HLS
        '-loglevel debug'       // Enable debug logging
      ])
      .on('start', (commandLine) => {
        console.log('FFmpeg process started with command: ' + commandLine);
      })
      .on('progress', (progress) => {
        console.log(`Processing: ${progress.percent}% done`);
      })
      .on('error', (err) => {
        console.error('Error during transcoding:', err.message);
        reject(new Error(`Transcoding failed: ${err.message}`));
      })
      .on('end', () => {
        console.log('Transcoding finished successfully!');
        resolve(outputFilePath);  // Resolving with the output file path
      })
      .run();
  });
};

// Example usage
// const inputVideoPath = path.join(__dirname, '../uploads/sample.mp4');
// const outputDirectory = path.join(__dirname, '../uploads/sample_output');

//? Transcode video to HLS format
// transcodeVideo(inputVideoPath, outputDirectory, (err, output) => {
//   if (err) {
//     console.error('Error:', err);
//   } else {
//     console.log('HLS playlist created at:', output);
//   }
// });
