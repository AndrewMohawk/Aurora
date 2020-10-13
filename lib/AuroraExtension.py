"""
Generic Extension class
"""
import board
import neopixel
import cv2
import os, sys
import logging
import time
import numpy as np

class AuroraExtension:
    
    def __init__(self):
        #Generic variables
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "Aurora Extension class"
        self.Name="Aurora Extension Class"

        self.vid = False
        self.vid_w = 0
        self.vid_h = 0
        self.channels = 0
        self.pixels = False 

        self.FPS_count = 0
        self.FPS_avg = 0
        self.FPS_start_time = 0

        self.debug = False

        logging.basicConfig(format='%(asctime)s %(message)s',datefmt='%m/%d/%Y %I:%M:%S %p')


        #Aurora Specifics
        try:
            self.pixelsCount = int(os.environ.get("AURORA_PIXELCOUNT_TOTAL"))
            self.pixelsLeft = int(os.environ["AURORA_PIXELCOUNT_LEFT"])
            self.pixelsRight = int(os.environ["AURORA_PIXELCOUNT_RIGHT"])
            self.pixelsTop = int(os.environ["AURORA_PIXELCOUNT_TOP"])
            self.pixelsBottom = int(os.environ["AURORA_PIXELCOUNT_BOTTOM"])
            self.debug = bool(os.environ["AURORA_DEBUG"])
            if(self.debug == True):
                
                logging.getLogger().setLevel(logging.DEBUG)
                
            else:
                logging.getLogger().setLevel(logging.ERROR)
                

        except Exception as e:
            self.log("Error during initialisation of {}:{}".format(self.Name,str(e),True))
            print("Error during initialisation of {}:{}".format(self.Name,str(e)))
            sys.exit(1)

       
        
    #Setup LEDs and Capture
    def setup(self):
        print("Setting Up {}".format(self.Name))
        try:
            #Init Capture
            self.vid = cv2.VideoCapture(0) 
            self.vid.set(cv2.CAP_PROP_BUFFERSIZE, 2)
            self.vid_w = int(self.vid.get(cv2.CAP_PROP_FRAME_WIDTH))
            self.vid_h = int(self.vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
            self.log("Initialized Aurora with feed of {} x {}".format(self.vid_w,self.vid_h))

            #Initial LED pixels
            self.pixels = neopixel.NeoPixel(board.D18, self.pixelsCount,auto_write=False)
            self.pixels.brightness = 1
        except Exception as e:
            #Lets not get here chaps.
            self.log("Error during initialisation of {}:{}".format(self.Name,str(e)),True)
            print("Error during initialisation of {}:{}".format(self.Name,str(e)))
            sys.exit(1)


    def teardown(self):
        #incase things need to be broken down
        print("Tearing down {}".format(self.Name))
        self.vid = False
        self.pixels = False
        
    
    def makePixelFrame(self,filepath):
        print("LeftPixels:{} RightPixels:{} TopPixels:{} BottomPixels:{}".format(self.pixelsLeft,self.pixelsRight,self.pixelsTop,self.pixelsBottom))
        if(self.pixels != False):
            pixel_size = 15
            pixel_size_skew = pixel_size * 2
            border = 15
            if(self.pixelsLeft > self.pixelsRight):
                pixelImageHeight = (self.pixelsLeft * pixel_size) + border + (pixel_size_skew*2)
            else:
                pixelImageHeight = (self.pixelsRight * pixel_size) + border + (pixel_size_skew*2)

            if(self.pixelsTop > self.pixelsBottom):
                pixelImageWidth = (self.pixelsTop * pixel_size) + border 
            else:
                pixelImageWidth = (self.pixelsBottom * pixel_size) + border 
            
            pixelImage = np.zeros((pixelImageHeight,pixelImageWidth,3), np.uint8)


            top_y = 5
            top_x = 5

            start_coordinate = 5 +pixel_size_skew

            #Left Rows
            for x in range(self.pixelsLeft-1,-1,-1):   #-1 since this actually starts at 0 and goes to num-1
                start = (top_x,start_coordinate)
                end = (top_x+pixel_size_skew,start_coordinate+pixel_size)
                colour = (self.pixels[x][2],self.pixels[x][1],self.pixels[x][0])
                pixelImage = cv2.rectangle(pixelImage, start, end, colour, -1)
                start_coordinate += pixel_size
            

            start_coordinate = 5
            #Top rows
            
            for x in range(self.pixelsLeft,self.pixelsLeft+self.pixelsTop):
                start = (start_coordinate,top_y)
                end = (start_coordinate+pixel_size,top_y+pixel_size_skew)
                colour = (self.pixels[x][2],self.pixels[x][1],self.pixels[x][0])
                pixelImage = cv2.rectangle(pixelImage, start, end, colour, -1)
                start_coordinate += pixel_size

            start_coordinate = 5 +pixel_size_skew
            #Right Rows
            for x in range(self.pixelsLeft+self.pixelsTop,self.pixelsLeft+self.pixelsTop+self.pixelsRight):
                start = (top_x+(self.pixelsTop*pixel_size)-pixel_size_skew,start_coordinate)
                end = (top_x+(self.pixelsTop*pixel_size),start_coordinate+pixel_size)

                colour = (self.pixels[x][2],self.pixels[x][1],self.pixels[x][0])
                color = (255,0,0)
                pixelImage = cv2.rectangle(pixelImage, start, end, colour, -1)
                start_coordinate += pixel_size

            start_coordinate = 5
            #Bottom rows
            for x in range(self.pixelsCount-1,self.pixelsLeft+self.pixelsTop+self.pixelsRight-1,-1):
                start = (start_coordinate,top_y+(self.pixelsLeft*pixel_size)+pixel_size_skew+pixel_size_skew)
                end = (start_coordinate+pixel_size,top_y+(self.pixelsLeft*pixel_size)+pixel_size_skew)
                colour = (self.pixels[x][2],self.pixels[x][1],self.pixels[x][0])
                pixelImage = cv2.rectangle(pixelImage, start, end, colour, -1)
                start_coordinate += pixel_size

            #Save Image
            cv2.imwrite(filepath,pixelImage) 
            self.log("Saved PixelImage")
        else:
            self.log("Pixels not available, no image saved")


    def getFrame(self,video=True):
        self.FPS_count += 1
        time_diff_fps = time.time() - self.FPS_start_time
        if(time_diff_fps >= 1):
            #self.log("--- FPS: {} ---".format(self.FPS_count))
            self.FPS_avg = self.FPS_count
            self.FPS_start_time = time.time()
            self.FPS_count = 0
            
        if(video == True):
            # Capture the video frame 
            ret, frame = self.vid.read()
            return [ret,frame]
        return True

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

    def log(self,log_string,error=False):
        if(error == True):
            logging.error("{}".format(log_string))
        elif(self.debug == True):
            logging.debug("DEBUG--{}".format(log_string))

    

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
        

    