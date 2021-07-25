from lib.AuroraExtension import AuroraExtension
import time

import numpy as np
import pandas as pd
import cv2


class Aurora_Ambient_16x9(AuroraExtension):
    def __init__(self, NeoPixels, HDMI):
        super().__init__(NeoPixels, HDMI)
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "This extension takes the HDMI input and crops the image to 16:9 (hopefully) removing the black borders"
        self.Name = "Aurora Ambient Lighting (16x9)"
        self.count = 0
        self.current_frame = False
        self.aspect_cropped_frame = False
        self.percent = 3
        self.aspectRatio = 16.0 / 9.0

    def aspectCrop(self, image, ratio):
        vid_h, vid_w, channels = image.shape
        # work out the size of the 'gaps'
        aspectRatioGap = vid_h - (vid_w / self.aspectRatio)
        aspectRatioGap = aspectRatioGap / 2  # since we want to put some top and bottom
        aspectRatioGap = int(aspectRatioGap)
        aspect_frame = image[aspectRatioGap : vid_h - aspectRatioGap, 0:vid_w]
        return aspect_frame

    def takeScreenShot(self, filepath):
        ret, self.current_frame = self.getFrame()
        vid_h, vid_w, channels = self.current_frame.shape
        aspectRatioGap = vid_h - (vid_w / self.aspectRatio)
        aspectRatioGap = aspectRatioGap / 2  # since we want to put some top and bottom
        aspectRatioGap = int(aspectRatioGap)
        borderEdges = [0, aspectRatioGap, 0, aspectRatioGap]
        return super().takeScreenShot(filepath, borderEdges=borderEdges)

    def visualise(self):
        # Capture the video frame
        ret, self.current_frame = self.getFrame()
        self.aspect_cropped_frame = self.aspectCrop(
            self.current_frame, self.aspectRatio
        )
        self.visualiseFrame(self.aspect_cropped_frame)
