from lib.AuroraExtension import AuroraExtension
import time
import datetime
import numpy as np
import pandas as pd
import cv2


class Aurora_Ambient_NoCrop(AuroraExtension):
    def __init__(self, NeoPixels, HDMI):
        super().__init__(NeoPixels, HDMI)
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "This extension takes the HDMI input and calculates a border (WITHOUT cropping) to work out ambient lighting for behind the display. This one is slightly faster as it doesnt need to do any of the maths to work out the cropping."
        self.Name = "Aurora Ambient Lighting ( No crop )"
        self.count = 0
        self.current_frame = False
        self.percent = 3

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

    def takeScreenShot(self, filepath):
        screenshot_frame = self.current_frame
        widthPixels = int(self.vid_w * (self.percent / 100)) + 1
        heightPixels = int(self.vid_h * (self.percent / 100) * 2) + 1

        colour = (0, 0, 255)
        # top
        screenshot_frame = cv2.rectangle(
            screenshot_frame, (0, 0), (self.vid_w, heightPixels), (0, 0, 255), 1
        )
        # bottom
        screenshot_frame = cv2.rectangle(
            screenshot_frame,
            (0, self.vid_h - heightPixels),
            (self.vid_w, self.vid_h),
            (0, 0, 255),
            1,
        )
        # left
        screenshot_frame = cv2.rectangle(
            screenshot_frame, (0, 0), (widthPixels, self.vid_h), (0, 0, 255), 1
        )
        # right
        screenshot_frame = cv2.rectangle(
            screenshot_frame,
            (self.vid_w - widthPixels, 0),
            (self.vid_w, self.vid_h),
            (0, 0, 255),
            1,
        )

        cv2.imwrite(filepath, screenshot_frame)

        return True

    def visualise(self):
        # Capture the video frame
        ret, self.current_frame = self.getFrame()
        self.visualiseFrame(self.current_frame)
