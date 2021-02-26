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

If you fall in love with the tool, you'll probably want to install it:
```
npm install -g https://github.com/jonathanperret/mrc-client
```
Then you can invoke it as just `mrc-client x.x.x.x`.

## Known issues

I've tried to tell `ffplay` to display frames as soon as it receives them,
but there's still some sluggishness. I don't mind as this is just a test tool,
but suggestions would be welcome if you know how to properly do it.

No attempt is made to process the audio frames. Again, I haven't needed audio
so far, but I think it wouldn't be very hard to add.

## Related tools

 * The official [Oculus plugin for OBS](https://github.com/facebookincubator/obs-plugins/tree/master/oculus-mrc)
   where I found the details of the MRC protocol.

 * @fabio914's awesome
   [RealityMixer](https://github.com/fabio914/RealityMixer) which can
   display your MRC stream on your iPhone, complete with background removal
   and composition.
