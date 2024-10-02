import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH =  path.resolve(__dirname, './streaming.proto');// Adjust this path as needed
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const streamingService = protoDescriptor.StreamingService;

const client = new streamingService('localhost:50051', grpc.credentials.createInsecure());

const call = client.StreamVideo({ movieId: 'file-1727861847546-13045193' });

call.on('data', (response) => {
  const videoChunk = response.videoChunk;
  // Process the video chunk (e.g., display it, write to a file, etc.)
  console.log('Received chunk:', videoChunk);
});

call.on('end', () => {
  console.log('Streaming ended.');
});

call.on('error', (err) => {
  console.error('Streaming error:', err);
});
