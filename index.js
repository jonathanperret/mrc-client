#!/usr/bin/env node

const { Socket } = require("net");
const { spawn } = require('child_process');

const serverAddress = process.argv[2];
const PORT = 28734;

const PayloadType = {
    VIDEO_DIMENSION: 10,
    VIDEO_DATA: 11,
    AUDIO_SAMPLERATE: 12,
    AUDIO_DATA: 13,
};
const FrameOffsets = {
  PAYLOAD_TYPE: 8,
  PAYLOAD_LENGTH: 12,
  PAYLOAD_START: 16,
}

function startStreaming(done) {
    let ffplay;
    let shouldExit = false;

    function startFFPlay() {
        ffplay = spawn('ffplay', [
            '-i', 'pipe:0',
            '-nostats',
            '-loglevel', 'error',
            '-probesize', '32',
            '-framerate', '100',
            '-flags', 'low_delay',
            '-vf', 'crop=in_w/2:in_h:0:0,vflip'
        ], {
            stdio: ['pipe', 'inherit', 'inherit']
        });

        ffplay.on('exit', (code, signal) => {
            console.log(`ffplay exited with ${code !== null ? code : signal}.`);
            ffplay = null;
            shouldExit = true;
            socket.destroy();
        });
    }

    const socket = new Socket();

    let buf = Buffer.alloc(0);
    socket.on("data", (data) => {
        buf = Buffer.concat([buf, data]);
        while (buf.length > FrameOffsets.PAYLOAD_START) {
            const payloadLength = buf.readUInt32LE(FrameOffsets.PAYLOAD_LENGTH);
            const packetSize = FrameOffsets.PAYLOAD_START + payloadLength;
            if (buf.length < packetSize) return;
            const type = buf.readUInt32LE(FrameOffsets.PAYLOAD_TYPE);
            const payload = buf.slice(FrameOffsets.PAYLOAD_START, packetSize);
            // console.log(type, payloadLength, payload);
            if (type == PayloadType.VIDEO_DATA) {
                ffplay.stdin.write(payload);
            }
            buf = buf.slice(packetSize);
        }
    });

    socket.on('close', () => {
        console.log('Connection closed.');
        if (ffplay) {
            ffplay.stdin.destroy();
            ffplay.kill();
        }
        done(shouldExit);
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err.message);
    });

    console.log(`Connecting to ${serverAddress}:${PORT}`);

    socket.connect(PORT, serverAddress, () => {
        console.log('Connection established.');
        shouldExit = true;
        startFFPlay();
    });
}

function startStreamingPromise() {
    return new Promise((resolve) => {
        startStreaming(resolve);
    });
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    while (!await startStreamingPromise()) {
        await delay(1000);
    }
}

main();
