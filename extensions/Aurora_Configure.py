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
    def __init__(self):
        super().__init__()
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "This extension configures the LEDs"
        self.Name="Aurora Ambient Lighting Configuration"
        self.count = 0
        self.current_frame = False
        self.percent = 3
        


    def takeScreenShot(self,filepath):
        return True

    def setup(self):
        print("Setting Up2 {}".format(self.Name))
        print("LeftPixels:{} RightPixels:{} TopPixels:{} BottomPixels:{} TotalPixels: {}".format(self.pixelsLeft,self.pixelsRight,self.pixelsTop,self.pixelsBottom,self.pixelsCount))
        try:
            #Initial LED pixels
            self.pixels = neopixel.NeoPixel(board.D18, self.pixelsCount,auto_write=False)
            self.pixels.brightness = 1
        except Exception as e:
            #Lets not get here chaps.
            self.log("Error during initialisation of {}:{}".format(self.Name,str(e)),True)
            print("Error during initialisation of {}:{}".format(self.Name,str(e)))
            sys.exit(1)

    def visualise(self):
        print("*"*50)
        print("VIS: LeftPixels:{} RightPixels:{} TopPixels:{} BottomPixels:{} TotalPixels: {}".format(self.pixelsLeft,self.pixelsRight,self.pixelsTop,self.pixelsBottom,self.pixelsCount))
        pos = 0
        #Left pixels
        colour = (255,0,0) #red
        
        for i in range(pos,pos+self.pixelsLeft):
            self.pixels[i] = colour
        
        
        pos = pos + self.pixelsLeft
        
        colour = (0,255,0) #green
        for x in range(pos,pos+self.pixelsTop):
            self.pixels[x] = colour
        #print(x)

        pos = pos + self.pixelsTop
        colour = (0,0,255) #blue
        for y in range(pos,pos+self.pixelsRight):
            self.pixels[y] = colour
        #print(y)
        pos = pos + self.pixelsRight
        #print("Pos:{} of {}".format(pos,self.pixelsCount))
        colour = (255,255,255) #white
        for z in range(pos,pos+self.pixelsBottom):
            self.pixels[z] = colour
        #print(z)
        #print(self.pixels)
        self.pixels.show()
        