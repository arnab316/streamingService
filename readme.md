# Movie Streaming Service

This project is a movie streaming service built with Node.js, designed to handle video uploads, transcoding, and streaming using gRPC. The application supports HLS (HTTP Live Streaming) and is structured to follow a microservices architecture.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Directory Structure](#directory-structure)
- [API Endpoints](#api-endpoints)
- [Transcoding](#transcoding)
- [Streaming](#streaming)
- [gRPC](#grpc)
- [License](#license)

## Features

- Upload videos in various formats.
- Transcode videos into HLS format for streaming.
- Stream videos using gRPC.
- Simple API for managing video uploads and streaming.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/movie-streaming-service.git
   cd movie-streaming-service
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Make sure you have [FFmpeg](https://ffmpeg.org/download.html) installed on your machine.

## Usage

1. Start the server:

   ```bash
   node src/app.js
   ```

2. The server will start and listen at `http://localhost:4003`.

3. You can upload videos by sending a POST request to the `/api/v1/upload` endpoint with the video file.

## Directory Structure

```
├── grpc
│   ├── grpcClient.js         # gRPC client implementation
│   ├── grpcServer.js         # gRPC server implementation
│   └── streaming.proto        # Protocol buffer definitions for streaming
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Exact versions of installed dependencies
├── readme.md                 # Project documentation
└── src
    ├── app.js                # Main application file
    ├── config                # Configuration files
    ├── controllers           # Controller logic for handling requests
    ├── routes                # API route definitions
    ├── services              # Business logic and service layers
    ├── transcode             # Transcoding logic and FFmpeg integration
    └── uploads               # Directory for uploaded videos and transcoded files
```

## API Endpoints

- `POST /upload`: Upload a video file.
- `GET /stream/:movieId`: Stream a video by its `movieId`.

## Transcoding

The service uses FFmpeg to transcode uploaded videos into HLS format. The transcoded files are stored in the `uploads` directory, and a `.m3u8` playlist file is generated for streaming.

## Streaming

To stream a video, use the `GET /stream/:movieId` endpoint, where `:movieId` is the identifier for the video.

## gRPC

This service uses gRPC for efficient video streaming. The gRPC server is implemented in `grpc/grpcServer.js`, and clients can connect using the protocol buffer definitions found in `grpc/streaming.proto`.
