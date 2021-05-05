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
        self.Name = "Aurora Ambient Lighting"
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
        self.vid_h, self.vid_w, self.channels = self.current_frame.shape

        self.vid_h, self.vid_w, self.channels = self.current_frame.shape
        
        if self.vid_h <= 1 and self.vid_w <= 1:
            self.pixels.fill((0, 0, 0))
            self.pixels.show()
            return

        widthPixels = int(self.vid_w * (self.percent / 100)) + 1
        heightPixels = int(self.vid_h * (self.percent / 100) * 2) + 1

        cutTime = datetime.datetime.now()

        sectionTop = self.current_frame[0:heightPixels, 0 : self.vid_w]
        sectionBottom = self.current_frame[
            self.vid_h - heightPixels : self.vid_h, 0 : self.vid_w
        ]

        sectionLeft = self.current_frame[0 : self.vid_h, 0:widthPixels]
        sectionRight = self.current_frame[
            0 : self.vid_h, self.vid_w - widthPixels : self.vid_w
        ]
        
        resizeTime = datetime.datetime.now()
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

        # Populate LEDs
        startPoint = 0
        for i in range(self.pixelsLeft):
            B, G, R = resizedLeft[i][0]
            self.pixels[self.pixelsLeft - (startPoint + i)-1] = (R, G, B)

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
            B, G, R = resizedBottom[0][i]
            self.pixels[startPoint + self.pixelsBottom - i - 1] = (R, G, B)

        self.pixels.show()

        # visualise!
        self.count += 1