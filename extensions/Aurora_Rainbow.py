from lib.AuroraExtension import AuroraExtension
import time
import datetime
import numpy as np
import pandas as pd
import cv2


class Aurora_Rainbow(AuroraExtension):
    def __init__(self, NeoPixels, HDMI):
        super().__init__(NeoPixels, HDMI)
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "This extension displays a rainbow pattern on the LEDs, a lot of this code is from https://learn.adafruit.com/circuitpython-essentials/circuitpython-neopixel"
        self.Name = "Aurora Rainbow Display ( LED Only )"
        self.count = 0
        self.current_frame = False
        self.noHDMI = True

    def takeScreenShot(self, filepath):
        # We have no screenshot since... well its just LEDs
        return True

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
        for i in range(self.pixelsCount):
            rc_index = (i * 256 // self.pixelsCount) + j
            self.pixels[i] = self.wheel(rc_index & 255)
        self.getFrame(False)  # hack to have 'FPS'
        self.pixels.show()

    def visualise(self):

        # visualise!
        self.count += 1
        self.rainbow_cycle(self.count)
        if self.count == 255:
            self.count = 0

        time.sleep(0.01)
