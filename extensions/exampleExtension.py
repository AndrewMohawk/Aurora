from lib.AuroraExtension import AuroraExtension
import time
from random import randint, choice
import numpy as np
import cv2


class exampleExtension(AuroraExtension):
    def __init__(self, NeoPixels, HDMI):
        super().__init__(NeoPixels, HDMI)
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "Extension Example"
        self.Name = "example extension"
        self.count = 0
        self.randomLED = 0
        self.randomSize = 0
        self.log("Extension {} Initiated".format(self.Name))

    # This doesnt need to be implemented, but can if you want
    # def takeScreenShot(self, filepath):

    # Fade LEDs to Black (so they dont instantly drop off)
    def fadeToBlack(self, pixelPos):
        fadeValue = 0.2
        b, g, r = self.pixels[pixelPos]

        r = 0 if r <= 10 else int(r - (r * fadeValue))
        g = 0 if g <= 10 else int(g - (g * fadeValue))
        b = 0 if b <= 10 else int(b - (b * fadeValue))
        self.pixels[pixelPos] = (b, g, r)

    # Fade LEDs to bright (or first block to 255) so they dont just spotlight
    def fadeToBright(self, pixelPos):

        fadeValue = 1.2
        b, g, r = self.pixels[pixelPos]

        if r == 255 or g == 255 or b == 255:
            return
        r = 255 if r >= 200 else int(r + (r * fadeValue))
        g = 255 if g >= 200 else int(g + (g * fadeValue))
        b = 255 if b >= 200 else int(b + (b * fadeValue))

        self.pixels[pixelPos] = (b, g, r)

    # This will 'visualise' whatever you want and will be called every ~0.01s
    def visualise(self):

        # Grab a 'frame' of the screen:
        ret, self.current_frame = self.getFrame()

        # Theres something on the screen
        if ret:
            self.count = self.count + 1

            if self.count <= 1:
                if self.count == 1:
                    self.log("Setting up colours")
                # Lets get a random size for our group of pixels between 5 and 50
                self.randomSize = randint(5, 50)

                # Lets pick a random LED to turn on
                self.randomLED = randint(0, self.pixelsCount - self.randomSize)

                # Lets get a random starting colour that we will scale up
                self.colour = (randint(0, 10), randint(0, 10), randint(0, 10))

                # Set the colour
                for x in range(self.randomLED, self.randomLED + self.randomSize):
                    self.pixels[x] = self.colour

            elif self.count < 20:
                if self.count == 2:
                    self.log("Fading up colours")
                # Fade it up
                for fade_up_pixel in range(
                    self.randomLED, (self.randomLED + self.randomSize)
                ):
                    self.fadeToBright(fade_up_pixel)

            elif self.count < 40:
                if self.count == 21:
                    self.log("Fading out colours")
                for fade_out_pixel in range(
                    self.randomLED, (self.randomLED + self.randomSize)
                ):
                    self.fadeToBlack(fade_out_pixel)

            else:
                if self.count == 40:
                    self.log("Resetting colours")
                self.count = 0

            # And show it
            self.pixels.show()
