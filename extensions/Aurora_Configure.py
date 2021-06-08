from lib.AuroraExtension import AuroraExtension
import neopixel
import time
import datetime
import numpy as np
import pandas as pd
import board
import cv2
import sys


class Aurora_Configure(AuroraExtension):
    def __init__(self, NeoPixels, HDMI):
        super().__init__(NeoPixels, HDMI)
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "This extension configures the LEDs"
        self.Name = "Aurora Ambient Lighting Configuration"
        self.count = 0
        self.current_frame = False
        self.percent = 3

    def setup(self):
        return True

    def visualise(self):
        # Capture the video frame
        ret, self.current_frame = self.getFrame()
        self.vid_h, self.vid_w, self.channels = self.current_frame.shape
        pos = 0

        colour = (255, 0, 0)  # red

        for i in range(pos, pos + self.pixelsLeft):
            self.pixels[i] = colour

        pos = pos + self.pixelsLeft

        colour = (0, 255, 0)  # green
        for x in range(pos, pos + self.pixelsTop):
            self.pixels[x] = colour

        pos = pos + self.pixelsTop
        colour = (0, 0, 255)  # blue
        for y in range(pos, pos + self.pixelsRight):
            self.pixels[y] = colour

        pos = pos + self.pixelsRight

        colour = (255, 255, 255)  # white
        for z in range(pos, pos + self.pixelsBottom):
            self.pixels[z] = colour

        self.pixels.show()
