"""
Generic Extension class
"""
#import board
#import neopixel
import cv2
import numpy as np
import os
import logging

class AuroraExtension:
    
    def __init__(self):
        #Generic variables
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "Generic Extension class"
        self.Name="Generic Extension"

        #Aurora Specifics
        try:
            self.pixelCount = os.environ.get("AURORA_PIXELCOUNT_TOTAL")
            self.pixelLeft = os.environ["AURORA_PIXELCOUNT_LEFT"]
            self.pixelRight = os.environ["AURORA_PIXELCOUNT_RIGHT"]
            self.pixelTop = os.environ["AURORA_PIXELCOUNT_TOP"]
            self.pixelBottom = os.environ["AURORA_PIXELCOUNT_BOTTOM"]
            #self.vid = cv2.VideoCapture(0) 
            #self.vid.set(cv2.CAP_PROP_BUFFERSIZE, 2)
            #self.vid_w = int(self.vid.get(cv2.CAP_PROP_FRAME_WIDTH))
            #self.vid_h = int(self.vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
            #self.log("Initialized Aurora with feed of {} x {}".format(self.vid_w,self.vid_h))
        except Exception as e:
            self.log("Error during initialisation of {}:{}".format(self.Name,str(e)))

        #Initial LED pixels
        #self.pixels = neopixel.NeoPixel(board.D18, numPixels,auto_write=False)
        #self.pixels.brightness = 1
        

        
    def takeScreenShot(self,filepath):

        # Create a black image
        img = np.zeros((512,512,3), np.uint8)

        # Draw a diagonal blue line with thickness of 5 px
        img = cv2.line(img,(0,0),(511,511),(255,0,0),5)

        img = cv2.rectangle(img,(384,0),(510,128),(0,255,0),3)
        img = cv2.circle(img,(447,63), 63, (0,0,255), -1)
        img = cv2.ellipse(img,(256,256),(100,50),0,0,180,255,-1)
        pts = np.array([[10,5],[20,30],[70,20],[50,10]], np.int32)
        pts = pts.reshape((-1,1,2))
        img = cv2.polylines(img,[pts],True,(0,255,255))
        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(img,'OpenCV',(10,500), font, 4,(255,255,255),2,cv2.LINE_AA)
        cv2.imwrite(filepath, img) 
        self.log("Saved Screenshot")
        #cv.waitKey(0)
        #cv.destroyAllWindows()

    def log(self,logString,type="Error"):
        logging.error("{}: {}".format(type,logString))

    def getFrame(self):
        # Capture the video frame 
        ret, frame = vid.read()
        return [ret,frame]

    # This class runs the visualisation (mandatory)
    def visualise(self):
        
        try:
            #In your inheritted class run things here
            self.example = True
        except Exception as e:
            print("Error: {}".format(e))

    # Returns the current FPS of the application ( not mandatory)
    def showFPS(self):
        return 0
        

    