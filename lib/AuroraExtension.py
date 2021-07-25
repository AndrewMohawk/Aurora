"""
Generic Extension class
"""

import cv2
import os, sys
import logging
import time
import numpy as np
import datetime


class AuroraExtension:
    def __init__(self, NeoPixels, HDMI):
        # Generic variables
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "Aurora Extension class"
        self.Name = "Aurora Extension Class"

        self.vid = HDMI
        self.vid_w = 1
        self.vid_h = 1
        self.channels = 0
        self.pixels = False

        self.FPS_count = 0
        self.FPS_avg = 0
        self.FPS_start_time = 0

        self.debug = bool(os.environ["AURORA_DEBUG"])
        self.noHDMI = False

        self.pixels = NeoPixels

        self.darkThreshhold = 20  # this defines if we are gonna bother lighting up the pixels if they are below this threshold
        # This is no longer used as it makes it noticably slower :(

        self.pixels.brightness = 1

        self.gamma = 1.0

        # Aurora Specifics
        try:
            self.pixelsCount = int(os.environ.get("AURORA_PIXELCOUNT_TOTAL"))
            self.pixelsLeft = int(os.environ["AURORA_PIXELCOUNT_LEFT"])
            self.pixelsRight = int(os.environ["AURORA_PIXELCOUNT_RIGHT"])
            self.pixelsTop = int(os.environ["AURORA_PIXELCOUNT_TOP"])
            self.pixelsBottom = int(os.environ["AURORA_PIXELCOUNT_BOTTOM"])
            self.gamma = float(os.environ["AURORA_GAMMA"])
            self.darkThreshhold = int(
                os.environ["AURORA_DARKTHRESHOLD"]
            )  # this defines if we are gonna bother lighting up the pixels if they are below this threshold
        # This is no longer used as it makes it noticably slower :(

        except Exception as e:
            self.log(
                "Error during initialisation of {}:{}".format(self.Name, str(e)), True
            )

            sys.exit(1)

    def fade_out_pixels(self):
        allout = False
        x = 0
        while allout == False:

            if x == self.pixelsCount:
                x = 0

            allout = True
            for z in range(0, self.pixelsCount):

                if self.pixels[z] != [0, 0, 0]:
                    allout = False
                    self.fadeToBlack(z)

            self.pixels.show()
            x += 1

    def fadeToBlack(self, pixelPos):
        fadeValue = 64
        b, g, r = self.pixels[pixelPos]

        r = 0 if r <= 10 else int(r - (r * fadeValue / 255))
        g = 0 if g <= 10 else int(g - (g * fadeValue / 255))
        b = 0 if b <= 10 else int(b - (b * fadeValue / 255))

        self.pixels[pixelPos] = (b, g, r)

    # Setup LEDs and Capture
    def setup(self):
        self.log("Setting Up {}".format(self.Name))

    def teardown(self):
        # incase things need to be broken down
        self.log("Tearing down {}".format(self.Name))
        self.fade_out_pixels()

    def makePixelFrame(self, filepath):
        if self.pixels != False:
            pixel_size = 15
            pixel_size_skew = pixel_size * 2
            border = 15
            if self.pixelsLeft > self.pixelsRight:
                pixelImageHeight = (
                    (self.pixelsLeft * pixel_size) + border + (pixel_size_skew * 2)
                )
            else:
                pixelImageHeight = (
                    (self.pixelsRight * pixel_size) + border + (pixel_size_skew * 2)
                )

            if self.pixelsTop > self.pixelsBottom:
                pixelImageWidth = (self.pixelsTop * pixel_size) + border
            else:
                pixelImageWidth = (self.pixelsBottom * pixel_size) + border

            pixelImage = np.zeros((pixelImageHeight, pixelImageWidth, 3), np.uint8)

            top_y = 5
            top_x = 5

            start_coordinate = 5 + pixel_size_skew

            # Left Rows
            for x in range(
                self.pixelsLeft - 1, -1, -1
            ):  # -1 since this actually starts at 0 and goes to num-1
                start = (top_x, start_coordinate)
                end = (top_x + pixel_size_skew, start_coordinate + pixel_size)
                colour = (self.pixels[x][2], self.pixels[x][1], self.pixels[x][0])
                pixelImage = cv2.rectangle(pixelImage, start, end, colour, -1)
                start_coordinate += pixel_size

            start_coordinate = 5
            # Top rows

            for x in range(self.pixelsLeft, self.pixelsLeft + self.pixelsTop):
                start = (start_coordinate, top_y)
                end = (start_coordinate + pixel_size, top_y + pixel_size_skew)
                colour = (self.pixels[x][2], self.pixels[x][1], self.pixels[x][0])
                pixelImage = cv2.rectangle(pixelImage, start, end, colour, -1)
                start_coordinate += pixel_size

            start_coordinate = 5 + pixel_size_skew
            # Right Rows
            for x in range(
                self.pixelsLeft + self.pixelsTop,
                self.pixelsLeft + self.pixelsTop + self.pixelsRight,
            ):
                start = (
                    top_x + (self.pixelsTop * pixel_size) - pixel_size_skew,
                    start_coordinate,
                )
                end = (
                    top_x + (self.pixelsTop * pixel_size),
                    start_coordinate + pixel_size,
                )

                colour = (self.pixels[x][2], self.pixels[x][1], self.pixels[x][0])
                color = (255, 0, 0)
                pixelImage = cv2.rectangle(pixelImage, start, end, colour, -1)
                start_coordinate += pixel_size

            start_coordinate = 5
            # Bottom rows
            for x in range(
                self.pixelsCount - 1,
                self.pixelsLeft + self.pixelsTop + self.pixelsRight - 1,
                -1,
            ):
                start = (
                    start_coordinate,
                    top_y
                    + (self.pixelsLeft * pixel_size)
                    + pixel_size_skew
                    + pixel_size_skew,
                )
                end = (
                    start_coordinate + pixel_size,
                    top_y + (self.pixelsLeft * pixel_size) + pixel_size_skew,
                )
                colour = (self.pixels[x][2], self.pixels[x][1], self.pixels[x][0])
                pixelImage = cv2.rectangle(pixelImage, start, end, colour, -1)
                start_coordinate += pixel_size

            # Save Image
            if pixelImageWidth > 800:
                r = 800 / float(pixelImageWidth)
                dim = (800, int(pixelImageHeight * r))
                pixelImage = cv2.resize(pixelImage, dim, interpolation=cv2.INTER_AREA)

            cv2.imwrite(filepath, pixelImage)
            # self.log("Saved PixelImage")
        else:
            self.log("Pixels not available, no image saved")

    def adjust_gamma(self, image, gamma=1.0):
        # build a lookup table mapping the pixel values [0, 255] to
        # their adjusted gamma values
        invGamma = 1.0 / gamma
        table = np.array(
            [((i / 255.0) ** invGamma) * 255 for i in np.arange(0, 256)]
        ).astype("uint8")
        # apply gamma correction using the lookup table
        return cv2.LUT(image, table)

    def getFrame(self, video=True):

        self.FPS_count += 1
        time_diff_fps = time.time() - self.FPS_start_time
        if time_diff_fps >= 1:
            self.FPS_avg = self.FPS_count
            self.FPS_start_time = time.time()
            self.FPS_count = 0

        if video == True:
            # Capture the video frame
            ret, frame = self.vid.read()
            if ret == False:
                self.log(
                    "We cannot connect to video device anymore, hopefully restarting.."
                )
                os._exit(1)
            # TODO: Gamma evaluation -- this slows stuff down, I'm not sure we need it.
            elif self.gamma > 1:
                frame = self.adjust_gamma(frame, self.gamma)
            return [ret, frame]

        return [False, False]

    # Take a screenshot and put the outline over it, use the border edges if neccessary
    def takeScreenShot(
        self, filepath, autocrop=False, aspectCrop=False, borderEdges=[0, 0, 0, 0]
    ):
        screenshot_frame = self.current_frame

        if autocrop != False:
            screenshot_frame = self.autocrop(self.current_frame, autocrop)
            # logging.info(f"Cropped Screenshot to {screenshot_frame.shape}")

        if aspectCrop != False:
            vid_h, vid_w, channels = screenshot_frame.shape
            aspectRatioGap = vid_h - (vid_w / self.aspectRatio)
            aspectRatioGap = (
                aspectRatioGap / 2
            )  # since we want to put some top and bottom
            aspectRatioGap = int(aspectRatioGap)
            # aspectRatioGap = 50
            borderEdges = [0, aspectRatioGap, 0, aspectRatioGap]
            # screenshot_frame = self.aspectCrop(self.current_frame,aspectCrop)
            self.vid_h, self.vid_w, self.channels = screenshot_frame.shape

        self.vid_h, self.vid_w, self.channels = screenshot_frame.shape

        # This is for the outline starting and ending points
        borderGap = 2  # distance away from the border so we can still see the lines
        self.log(borderEdges)
        borderTop = 0 + borderGap - 2 + borderEdges[1]
        borderLeft = 0 + borderGap - 2 + borderEdges[0]
        borderBottom = self.vid_h - borderGap - borderEdges[3]
        borderRight = self.vid_w - borderGap - borderEdges[2]
        # 133,0,345,638

        # border sizes
        widthPixels = int(borderRight * (self.percent / 100)) + 1
        heightPixels = int(borderBottom * (self.percent / 100) * 2) + 1

        if widthPixels < 15:
            widthPixels = 15
        if heightPixels < 12:
            heightPixels = 12

        borderColour = (0, 0, 255)

        self.vid_h, self.vid_w, self.channels = screenshot_frame.shape

        # This is for the outline starting and ending points
        borderGap = 2  # distance away from the border so we can still see the lines
        self.log(borderEdges)
        borderTop = 0 + borderGap - 2 + borderEdges[1]
        borderLeft = 0 + borderGap - 2 + borderEdges[0]
        borderBottom = self.vid_h - borderGap - borderEdges[3]
        borderRight = self.vid_w - borderGap - borderEdges[2]
        # 133,0,345,638

        # border sizes
        widthPixels = int(borderRight * (self.percent / 100)) + 1
        heightPixels = int(borderBottom * (self.percent / 100) * 2) + 1

        if widthPixels < 15:
            widthPixels = 15
        if heightPixels < 12:
            heightPixels = 12

        borderColour = (0, 0, 255)

        # top
        screenshot_frame = cv2.rectangle(
            screenshot_frame,
            (borderLeft, borderTop),
            (borderRight, borderTop + heightPixels),
            borderColour,
            1,
        )

        # bottom
        screenshot_frame = cv2.rectangle(
            screenshot_frame,
            (0, borderBottom - heightPixels),
            (borderRight, borderBottom),
            borderColour,
            1,
        )
        # left
        screenshot_frame = cv2.rectangle(
            screenshot_frame,
            (borderLeft, borderTop),
            (widthPixels, borderBottom),
            borderColour,
            1,
        )
        # right
        screenshot_frame = cv2.rectangle(
            screenshot_frame,
            (borderRight - widthPixels, borderTop),
            (borderRight, borderBottom),
            borderColour,
            1,
        )

        cv2.imwrite(filepath, screenshot_frame)

        return True

    def log(self, log_string, error=False):
        if error == True:
            logging.error("{} : {}".format(self.Name, log_string))
        elif self.debug == True:
            logging.debug("DEBUG {} : {}".format(self.Name, log_string))

    # This class runs the visualisation (mandatory)
    def visualiseFrame(self, frame):
        self.current_frame = frame
        try:
            # In your inheritted class run things here
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
            topSize = 1 if self.pixelsTop == 0 else self.pixelsTop
            resizedTop = cv2.resize(
                sectionTop, (topSize, hs), interpolation=cv2.INTER_AREA
            )
            bottomSize = 1 if self.pixelsBottom == 0 else self.pixelsBottom
            resizedBottom = cv2.resize(
                sectionBottom, (bottomSize, hs), interpolation=cv2.INTER_AREA
            )

            # get shape for sides
            h, w, c = sectionLeft.shape
            hs = self.pixelsLeft
            ws = 1
            leftSize = 1 if self.pixelsLeft == 0 else self.pixelsLeft
            resizedLeft = cv2.resize(
                sectionLeft, (ws, leftSize), interpolation=cv2.INTER_AREA
            )
            rightSize = 1 if self.pixelsRight == 0 else self.pixelsRight
            resizedRight = cv2.resize(
                sectionRight, (ws, rightSize), interpolation=cv2.INTER_AREA
            )

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
                if any(val > self.darkThreshhold for val in resizedBottom[0][i]):
                    B, G, R = resizedBottom[0][i]
                self.pixels[startPoint + self.pixelsBottom - i - 1] = (R, G, B)

            for key, test_cols in enumerate(self.pixels):
                if all(val < self.darkThreshhold for val in test_cols):
                    self.pixels[key] = (0, 0, 0)

            # self.log(f"DisplayTime: {datetime.datetime.now()-stopwatchStartTime}")
            # self.log(f"Total time taken: {datetime.datetime.now()-totalStartTime}")
            self.pixels.show()

            # self.log(f"Total time taken: {datetime.datetime.now()-totalStartTime}")
            # self.log("----------------------")
            # visualise!
            self.count += 1
        except Exception as e:
            self.log(f"Error: {str(e)}")

    # Returns the current FPS of the application ( not mandatory)
    def showFPS(self):
        return 0
