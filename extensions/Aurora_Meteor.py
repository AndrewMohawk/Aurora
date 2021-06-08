from lib.AuroraExtension import AuroraExtension
import time
import datetime
import numpy as np
import pandas as pd
import cv2
from random import randint


class Aurora_Meteor(AuroraExtension):
    def __init__(self, NeoPixels, HDMI):
        super().__init__(NeoPixels, HDMI)
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = (
            "This has a 'meteor' effect in a random colour that shoots around the strip"
        )
        self.Name = "Aurora Meteor Display ( LED Only )"
        self.count = 0
        self.current_frame = False
        self.meteorSize = 10
        self.currentCol = (255, 0, 0)
        self.noHDMI = True
        self.startTime = time.time()

    def takeScreenShot(self, filepath):
        # We have no screenshot since... well its just LEDs
        return True

    def fadeToBlack(self, pixelPos):
        fadeValue = 64
        b, g, r = self.pixels[pixelPos]

        r = 0 if r <= 10 else int(r - (r * fadeValue / 255))
        g = 0 if g <= 10 else int(g - (g * fadeValue / 255))
        b = 0 if b <= 10 else int(b - (b * fadeValue / 255))

        self.pixels[pixelPos] = (b, g, r)

    def meteorRain(self, i, col):

        # Fade out
        for j in range(self.pixelsCount):
            if randint(0, 10) > 5:
                self.fadeToBlack(j)

        for j in range(self.meteorSize):
            if (i - j < self.pixelsCount) and (i - j >= 0):
                self.pixels[i - j] = col

        self.pixels.show()

    def visualise(self):

        # visualise!
        self.count += 5
        self.meteorRain(self.count, self.currentCol)
        if self.count >= self.pixelsCount + self.meteorSize:
            end = time.time()
            diff = end - self.startTime
            self.startTime = time.time()
            self.count = 0
            self.currentCol = (randint(0, 255), randint(0, 255), randint(0, 255))
