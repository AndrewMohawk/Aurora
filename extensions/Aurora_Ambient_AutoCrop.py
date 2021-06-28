from lib.AuroraExtension import AuroraExtension
import time
import datetime
import numpy as np
import pandas as pd
import cv2


class Aurora_Ambient_AutoCrop(AuroraExtension):
    def __init__(self, NeoPixels, HDMI):
        super().__init__(NeoPixels, HDMI)
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "This extension takes the HDMI input and calculates a border (including cropping for black borders) to work out ambient lighting for behind the display."
        self.Name = "Aurora Ambient Lighting ( AutoCrop )"
        self.count = 0
        self.current_frame = False
        self.cropped_frame = False
        self.percent = 3
        self.edgeDarkness = (
            5  # this defines the darkness that makes the edges for autocrop
        )
        

    def takeScreenShot(self, filepath, autocrop=False):
        return super().takeScreenShot(filepath, self.edgeDarkness)

    def visualise(self):
        # Capture the video frame
        # stopwatchStartTime = datetime.datetime.now()
        # totalStartTime = stopwatchStartTime
        ret, self.current_frame = self.getFrame()
        self.vid_h, self.vid_w, self.channels = self.current_frame.shape
        # self.log(f"GetFrame: {datetime.datetime.now()-stopwatchStartTime}")

        # stopwatchStartTime = datetime.datetime.now()
        self.current_frame = self.autocrop(self.current_frame, self.edgeDarkness)
        # self.log(f"AutoCropTime: {datetime.datetime.now()-stopwatchStartTime}")

        stopwatchStartTime = datetime.datetime.now()
        self.vid_h, self.vid_w, self.channels = self.current_frame.shape

        if self.vid_h <= 1 and self.vid_w <= 1:
            if len([pixel for pixel in self.pixels if pixel != (0, 0, 0)]) > 0:
                self.pixels.fill((0, 0, 0))
                self.pixels.show()
            return

        widthPixels = int(self.vid_w * (self.percent / 100)) + 1
        heightPixels = int(self.vid_h * (self.percent / 100) * 2) + 1

        sectionTop = self.current_frame[0:heightPixels, 0 : self.vid_w]
        sectionBottom = self.current_frame[
            self.vid_h - heightPixels : self.vid_h, 0 : self.vid_w
        ]

        sectionLeft = self.current_frame[0 : self.vid_h, 0:widthPixels]
        sectionRight = self.current_frame[
            0 : self.vid_h, self.vid_w - widthPixels : self.vid_w
        ]

        # get shape
        h, w, c = sectionTop.shape
        hs = 1
        ws = self.pixelsTop

        resizedTop = cv2.resize(sectionTop, (ws, hs), interpolation=cv2.INTER_AREA)
        resizedBottom = cv2.resize(
            sectionBottom, (ws, hs), interpolation=cv2.INTER_AREA
        )

        # get shape for sides
        h, w, c = sectionLeft.shape
        hs = self.pixelsLeft
        ws = 1

        resizedLeft = cv2.resize(sectionLeft, (ws, hs), interpolation=cv2.INTER_AREA)
        resizedRight = cv2.resize(sectionRight, (ws, hs), interpolation=cv2.INTER_AREA)

        # self.log(f"ResizeTime: {datetime.datetime.now()-stopwatchStartTime}")
        # stopwatchStartTime = datetime.datetime.now()
        # Populate LEDs
        startPoint = 0

        for i in range(self.pixelsLeft):            
            B, G, R = resizedLeft[i][0]
            self.pixels[self.pixelsLeft - (startPoint + i) - 1] = (R, G, B)
        startShowTime = datetime.datetime.now()
        startPoint += self.pixelsLeft
        for i in range(self.pixelsTop):
            B, G, R = resizedTop[0][i]
            self.pixels[startPoint + i] = (R, G, B)

        startPoint += self.pixelsTop
        for i in range(self.pixelsRight):
            B, G, R = resizedRight[i][0]
            self.pixels[startPoint + i] = (R, G, B)

        startPoint += self.pixelsRight
        for i in range(self.pixelsBottom):
            B, G, R = (0, 0, 0)
            if(any(val > self.darkThreshhold for val in resizedBottom[0][i])):
                B, G, R = resizedBottom[0][i]
            self.pixels[startPoint + self.pixelsBottom - i - 1] = (R, G, B)

        for key,test_cols in enumerate(self.pixels):
            if(all(val < self.darkThreshhold for val in test_cols)):
               self.pixels[key] = (0,0,0)
        # self.log(f"DisplayTime: {datetime.datetime.now()-stopwatchStartTime}")
        # self.log(f"Total time taken: {datetime.datetime.now()-totalStartTime}")
        self.pixels.show()

        # self.log(f"Total time taken: {datetime.datetime.now()-totalStartTime}")
        # self.log("----------------------")
        # visualise!
        self.count += 1
