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

    def autocrop(self, image, threshold=0):
        """Crops any edges below or equal to threshold
        Crops blank image to 1x1.
        Returns cropped image.
        """
        if len(image.shape) == 3:
            flatImage = np.max(image, 2)
        else:
            flatImage = image
        assert len(flatImage.shape) == 2

        rows = np.where(np.max(flatImage, 0) > threshold)[0]
        if rows.size:
            cols = np.where(np.max(flatImage, 1) > threshold)[0]
            image = image[cols[0] : cols[-1] + 1, rows[0] : rows[-1] + 1]
        else:
            image = image[:1, :1]

        return image

    def visualise(self):
        # Capture the video frame
        # stopwatchStartTime = datetime.datetime.now()
        # totalStartTime = stopwatchStartTime
        ret, self.current_frame = self.getFrame()
        self.vid_h, self.vid_w, self.channels = self.current_frame.shape
        # self.log(f"GetFrame: {datetime.datetime.now()-stopwatchStartTime}")

        # stopwatchStartTime = datetime.datetime.now()
        self.autocropped_frame = self.autocrop(self.current_frame, self.edgeDarkness)
        # self.log(f"AutoCropTime: {datetime.datetime.now()-stopwatchStartTime}")

        self.visualiseFrame(self.autocropped_frame)
