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

// gRPC server-side streaming function
function streamVideo(call) {
  const { movieId } = call.request;
  const videoPath = path.join(__dirname, `../uploads/${movieId}.mp4`);

  if (fs.existsSync(videoPath)) {
    const videoStream = fs.createReadStream(videoPath);
    videoStream.on('data', (chunk) => {
      call.write({ videoChunk: chunk });
    });
    videoStream.on('end', () => call.end());
  } else {
    console.error(`Video not found: ${videoPath}`);
    call.end();
  }
}

const server = new grpc.Server();
server.addService(streamingService.service, { streamVideo });

server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }
  console.log(`gRPC server running at http://localhost:${port}`);
});
