# mrc-client

This tool will connect to an Oculus Quest VR headset running a VR app
supporting the Oculus MRC protocol (as used by the official Oculus OBS
plugin,
https://github.com/facebookincubator/obs-plugins/tree/master/oculus-mrc),
and display the video being streamed by the headset.

Only the "background" part of the video stream is shown, in which actually
the whole scene is rendered. In normal (mixed reality) usage, a real camera's
chroma-keyed (i.e. green screen removed) image would be overlaid on that
video, and then the "foreground" part of the video would be overlaid on top
to show the objects that are closer to the camera than the player.

I made this script to test the MRC output from my Quest games, without having
to fire up OBS and also because the Oculus MRC plugin for OBS doesn't support
macOS.

## Requirements

You need a reasonably recent NodeJS.

You also need `ffplay` (which generally comes with `ffmpeg`, i.e.
`brew install ffmpeg` or `sudo apt install ffmpeg`).

This script was tested on macOS, it will probably work on Linux. Windows
might need some changes.

## Usage

```
npx https://github.com/jonathanperret/mrc-client x.x.x.x
```

Where `x.x.x.x` is to be replaced with the IP address of your Quest running
an MRC-enabled VR app.

If the tool can't connect to the MRC stream, it will keep trying, so you
can launch it before going into your headset to launch the app.
