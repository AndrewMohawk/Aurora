from lib.AuroraExtension import AuroraExtension
import time
from random import randint
import numpy as np
import cv2

class exampleExtension(AuroraExtension):
    def __init__(self,NeoPixels):
        super().__init__(NeoPixels)
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "Extension Example"
        self.Name="example extension"
        self.count = 0

    def takeScreenShot(self,filepath):

        # Create a black image
        img = np.zeros((512,512,3), np.uint8)

        # Draw a diagonal blue line with thickness of 5 px
        img = cv2.line(img,(0,0),(511,511),(255,0,0),5)

        img = cv2.rectangle(img,(384,0),(510,128),(0,255,0),3)
        img = cv2.circle(img,(447,63), 63, (randint(0, 255),randint(0, 255),randint(0, 255)), -1)
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

    def visualise(self):
        #visualise!
        self.count += 1
        #print("{} : {}".format(self.Name,self.count))
        
        