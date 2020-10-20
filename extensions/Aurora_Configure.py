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
    def __init__(self,NeoPixels):
        super().__init__(NeoPixels)
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "This extension configures the LEDs"
        self.Name="Aurora Ambient Lighting Configuration"
        self.count = 0
        self.current_frame = False
        self.percent = 3
        


    def takeScreenShot(self,filepath):
        return True

    def setup(self):
        return True

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
        
        self.pixels.show()
        