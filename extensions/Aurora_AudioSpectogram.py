from lib.AuroraExtension import AuroraExtension
import time
import datetime
import numpy as np
import pandas as pd
import sounddevice as sd
from time import sleep
import sys
from collections import deque
import math


class Aurora_AudioSpectogram(AuroraExtension):
    def __init__(self, NeoPixels, HDMI):
        super().__init__(NeoPixels, HDMI)
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "This extension creates a rainbow audio spectogram, based somewhat on the code found at https://python-sounddevice.readthedocs.io/en/0.3.3/examples.html"
        self.Name = "Aurora Audio Spectrogram"
        self.count = 0
        self.current_frame = False
        self.columns = 100
        self.gain = 10
        self.low = 10
        self.high = 2500
        # Lets find the right device
        self.deviceID = sd.default.device["input"]

        self.log("Starting Audio spectogram with Device {}".format(self.deviceID))
        self.samplerate = sd.query_devices(self.deviceID, "input")["default_samplerate"]
        self.delta_f = (self.high - self.low) / (self.columns - 1)
        self.fftsize = math.ceil(self.samplerate / self.delta_f)
        self.low_bin = math.floor(self.low / self.delta_f)
        self.threshhold = 40

        self.pixelCount_nobottom = self.pixelsLeft + self.pixelsRight + self.pixelsTop

        self.streamstarted = False
        self.noHDMI = True

    def takeScreenShot(self, filepath):
        # We have no screenshot since... well its just LEDs
        return True

    def startAudioStream(self):
        if self.streamstarted == True:
            while self.streamstarted == True:
                with sd.InputStream(
                    device=self.deviceID,
                    channels=1,
                    callback=self.visualiseAudio,
                    blocksize=int(self.samplerate * 50 / 1000),
                    samplerate=self.samplerate,
                ):
                    # running stream
                    sd.wait()

    def teardown(self):
        # incase things need to be broken down
        self.log("Tearing down {}".format(self.Name))
        self.fade_out_pixels()
        sd.stop()

    def fadeToBlack(self, pixelPos):
        fadeValue = 128
        b, g, r = self.pixels[pixelPos]

        r = 0 if r <= 10 else int(r - (r * fadeValue / 255))
        g = 0 if g <= 10 else int(g - (g * fadeValue / 255))
        b = 0 if b <= 10 else int(b - (b * fadeValue / 255))

        self.pixels[pixelPos] = (b, g, r)

    def wheel(self, pos):
        # Input a value 0 to 255 to get a color value.
        # The colours are a transition r - g - b - back to r.
        if pos < 0 or pos > 255:
            return (0, 0, 0)
        if pos < 85:
            return (255 - pos * 3, pos * 3, 0)
        if pos < 170:
            pos -= 85
            return (0, 255 - pos * 3, pos * 3)
        pos -= 170
        return (pos * 3, 0, 255 - pos * 3)

    def rainbow_cycle(self, j):
        for i in range(self.pixelCount_nobottom):
            rc_index = (i * 256 // self.pixelCount_nobottom) + j
            self.pixels[i] = self.wheel(rc_index & 255)
        self.getFrame(False)  # hack to have 'FPS'
        self.pixels.show()

    def visualiseAudio(self, indata, frames, time, status):
        if any(indata):

            magnitude = np.abs(np.fft.rfft(indata[:, 0], n=self.fftsize))
            magnitude *= self.gain / self.fftsize
            audio_channels = []

            for x in magnitude[self.low_bin : self.low_bin + self.columns]:
                audio_channel_val = int(np.clip(x, 0, 1) * (255))

                if audio_channel_val >= self.threshhold:
                    audio_channels.append(audio_channel_val)
                else:
                    audio_channels.append(0)

            d = deque(audio_channels)
            d.rotate(self.pixelsLeft)  # start top left? why not.
            audio_channels = list(d)

            chan_led_width = round(self.pixelCount_nobottom / len(audio_channels))

            for key, val in enumerate(audio_channels):

                first_pixel = key * chan_led_width
                last_pixel = first_pixel + chan_led_width - 1
                if last_pixel > self.pixelCount_nobottom:
                    last_pixel = self.pixelCount_nobottom - 1

                for pNum in range(first_pixel, last_pixel + 1):
                    col = self.wheel(pNum)
                    if val != 0:
                        self.pixels[pNum] = col
                    else:
                        self.fadeToBlack(pNum)

            count = 0
            for x in audio_channels:
                if x != 0:
                    count += 1

            testLine = ""
            for i in range(len(audio_channels)):
                testLine += str(audio_channels[i]).zfill(2) + "|"

            count = 0
            for x in self.pixels:
                if x != [0, 0, 0]:
                    count += 1

            self.pixels.show()
        else:
            self.log("No Audio data in")

    def visualise(self):
        with sd.InputStream(
            device=self.deviceID,
            channels=1,
            callback=self.visualiseAudio,
            blocksize=int(self.samplerate * 50 / 1000),
            samplerate=self.samplerate,
        ):
            # running stream
            sd.wait()

        time.sleep(0.01)
