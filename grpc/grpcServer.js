import  grpc from '@grpc/grpc-js';
import  protoLoader from '@grpc/proto-loader';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load gRPC definitions
const PROTO_PATH = path.resolve(__dirname, './streaming.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// Access the StreamingService from the loaded protoDescriptor
const streamingService = protoDescriptor.StreamingService;

if (!streamingService) {
  console.error("StreamingService is undefined. Check if proto is loaded correctly.");
  process.exit(1);
}

//* gRPC server-side streaming function

function streamVideo(call) {
  const { movieId } = call.request;
  const playlistPath = path.join(__dirname, `../uploads/${movieId}/output.m3u8`);

  if (fs.existsSync(playlistPath)) {
    const playlistStream = fs.createReadStream(playlistPath);
    let tsFiles = [];

    playlistStream.on('data', (chunk) => {
      // Convert the chunk to string and split by line
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        const trimmedLine = line.trim();
        // Check if the line is a .ts file reference
        if (trimmedLine && trimmedLine.endsWith('.ts')) {
          tsFiles.push(trimmedLine);
        }
      }
    });

    playlistStream.on('end', () => {
      // Stream each .ts file sequentially
      let index = 0;

      function streamNext() {
        if (index < tsFiles.length) {
          const tsFileName = tsFiles[index];
          const tsFilePath = path.join(__dirname, `../uploads/${movieId}/${tsFileName}`);

          if (fs.existsSync(tsFilePath)) {
            const tsStream = fs.createReadStream(tsFilePath);

            tsStream.on('data', (tsChunk) => {
              call.write({ videoChunk: tsChunk });
            });

            tsStream.on('end', () => {
              console.log(`Finished streaming ${tsFileName}`);
              index++;
              streamNext(); // Call the next .ts file
            });

            tsStream.on('error', (err) => {
              console.error(`Error reading ${tsFileName}:`, err);
              index++;
              streamNext(); // Proceed to the next file even if there's an error
            });
          } else {
            console.error(`TS file not found: ${tsFilePath}`);
            index++;
            streamNext(); // Proceed to the next file
          }
        } else {
          call.end(); // End the stream after all .ts files are processed
        }
      }

      streamNext(); // Start streaming the first .ts file
    });

  } else {
    console.error(`Playlist not found: ${playlistPath}`);
    call.end();
  }
}




//* Define and Start the server 
const server = new grpc.Server();
server.addService(streamingService.service, { streamVideo });

server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }
  console.log(`gRPC server running at http://localhost:${port}`);
});
