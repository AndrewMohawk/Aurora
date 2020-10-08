# import the opencv library 
import cv2 
import sys
import numpy as np
import math
import pandas as pd 
import time

import board
import neopixel
import time
from random import randint
import datetime

numPixels = 300
pixels = neopixel.NeoPixel(board.D18, numPixels,auto_write=False)
pixels.brightness = 1

topPixels = 85 #pixels top
bottomPixels = 85 #pixels bottom
leftPixels = 49 #pixels Left
rightPixels = 49 #pixels right

showWindows = False
fpsTest = True
flipImage = False

#work out percentages to use for border
percent = 1


def singleColChase():
    for i in range(3,300):
        pixels.fill((0,0,0))
        pixels[i-2] = (255,255,0)
        pixels[i-1] = (0,255,255)
        pixels[i] = (255,0,255)
        time.sleep(delay)
        pixels.show()

def setRangePixels(start,end,col):
    for i in range(start,end):
        pixels[i] = col
    pixels.show()

def raceTrack(col,numPixels,delay=0.002):
    for i in range(1,numPixels):
        pixels[i-1] = (0,0,0)
        pixels[i] = col
        time.sleep(delay)
        pixels.show()


setupTest = False
if(setupTest):
    for i in range(1,numPixels):
        pixels[i-1] = (0,0,0)
        pixels[i] = (255,0,0)
        time.sleep(0.002)
        pixels.show()

# define a video capture object 
vid = cv2.VideoCapture(0) 
vid.set(cv2.CAP_PROP_BUFFERSIZE, 2)
#vid = cv2.VideoCapture("colourtest_from_youtube.mp4")
#vid.set(cv2.CAP_PROP_FRAME_WIDTH, int(800))
#vid.set(cv2.CAP_PROP_FRAME_HEIGHT, int(600))
print(vid.get(cv2.CAP_PROP_FPS))
# get image sizes
vid_w = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH))
vid_h = int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
print("Starting with feed of {} x {}".format(vid_w,vid_h))

widthPixels = int(vid_w * (percent/100))
heightPixels = int(vid_h * (percent/100))

# https://stackoverflow.com/questions/13538748/crop-black-edges-with-opencv
def autocrop(image, threshold=0):
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
        image = image[cols[0]: cols[-1] + 1, rows[0]: rows[-1] + 1]
    else:
        image = image[:1, :1]

    return image

def autocrop2(image):
    # Mask of non-black pixels (assuming image has a single channel).
    mask = image > 0
    
    # Coordinates of non-black pixels.
    coords = np.argwhere(mask)
    
    # Bounding box of non-black pixels.
    x0, y0 = coords.min(axis=0)
    x1, y1 = coords.max(axis=0) + 1   # slices are exclusive at the top
    
    # Get the contents of the bounding box.
    cropped = image[x0:x1, y0:y1]
    return cropped
FPSTime = time.time()
framespersecond_count = 0
try:
    while(True): 
        start_time = datetime.datetime.now()
        # Capture the video frame 
        ret, frame = vid.read()
        
        print("Video Frame: \t{}".format(datetime.datetime.now() - start_time))
        vid_h, vid_w, channels = frame.shape 
        
        crop_time = datetime.datetime.now()
        #print("Image dimensions pre-crop {} {}".format(vid_h,vid_w))
        frame = autocrop(frame)
        vid_h, vid_w, channels = frame.shape 
        print("Crop Time: \t{}".format(datetime.datetime.now() - crop_time))
        
        #print("Image dimensions {} {}".format(vid_h,vid_w))
        if(vid_h <= 1 and vid_w <= 1):
            print("Empty image {} {}".format(vid_h,vid_w))
            #print(ret)
            
            pixels.fill((0, 0, 0))
            pixels.show()
            continue
        
        
        #cv2.imwrite("frame%d.jpg" % ret, frame) 
        #if(flipImage == True):
        #    frame = cv2.flip(frame,1)
        # img[y:y+h, x:x+w]
        
        

        widthPixels = int(vid_w * (percent/100)) + 1
        heightPixels = int(vid_h * (percent/100)) + 1

        

        cutTime = datetime.datetime.now()
        
        sectionTop = frame[0:heightPixels,0:vid_w]
        sectionBottom = frame[vid_h-heightPixels:vid_h,0:vid_w]
        
        sectionLeft = frame[0:vid_h,0:widthPixels]
        sectionRight = frame[0:vid_h,vid_w-widthPixels:vid_w]

        
        print("Cut Time: \t{}".format(datetime.datetime.now() - cutTime))
        resizeTime = datetime.datetime.now()
        # get shape
        h, w, c = sectionTop.shape
        hs = 1
        ws = topPixels
        
        # resize image using block averaging
        #print("b {} {} {}".format(sectionTop,ws,hs))
        #print("0:{},0:{}".format(heightPixels,vid_w))
        resizedTop = cv2.resize(sectionTop, (ws,hs), interpolation = cv2.INTER_AREA)
        resizedBottom = cv2.resize(sectionBottom, (ws,hs), interpolation = cv2.INTER_AREA)
        

        #get shape for sides
        h,w,c = sectionLeft.shape
        hs = leftPixels
        ws = 1
        #print("c")
        resizedLeft = cv2.resize(sectionLeft, (ws,hs), interpolation = cv2.INTER_AREA)
        resizedRight = cv2.resize(sectionRight, (ws,hs), interpolation = cv2.INTER_AREA)

        print("Resize Time: \t{}".format(datetime.datetime.now() - resizeTime))
        #Finished calculations


        #Populate LEDs
        startPoint = 0
        for i in range(leftPixels):
            B,G,R = resizedLeft[i][0]
            pixels[leftPixels - (startPoint + i)] = (R,G,B)
        #print(pixels)
        
        startPoint += leftPixels
        for i in range(topPixels):
            B,G,R = resizedTop[0][i]
            pixels[startPoint + i] = (R,G,B)
        
        startPoint += topPixels
        for i in range(rightPixels):
            B,G,R = resizedRight[i][0]
            pixels[startPoint + i] = (R,G,B)
        
        startPoint += rightPixels
        #print("starting at {} adding {} pixels".format(startPoint,bottomPixels))
        for i in range(bottomPixels):
            B,G,R = resizedBottom[0][i]
            pixels[startPoint + bottomPixels - i -1] = (R,G,B)
        '''
        print("Showing {} Pixels".format(len(pixels)))

        for x in range(10):
            print("Pixels {}: {}".format(x,pixels[x]))
        
        for x in range(290,300):
            print("Pixels {}: {}".format(x,pixels[x]))
        '''
        pixels.show()
        
        if(fpsTest):
            framespersecond_count+=1
            end = time.time() - FPSTime
            if(end >= 1):
                print("--- FPS: {} ---".format(framespersecond_count))
                FPSTime = time.time()
                framespersecond_count = 0

        if( showWindows ):
            cv2.imshow('TopPixels', cv2.resize(resizedTop,(600,5)))
            cv2.imshow('LeftPixels', cv2.resize(resizedLeft,(5,600)))
            cv2.imshow('RightPixels', cv2.resize(resizedRight,(5,600)))
            cv2.imshow('BottomPixels', cv2.resize(resizedBottom,(600,5)))
            cv2.imshow('Main Image', cv2.resize(frame,(360,240)))
            

            # the 'q' button is set as the 
            # quitting button you may use any 
            # desired button of your choice 
            if cv2.waitKey(1) & 0xFF == ord('q'): 
                break
        print("Total Time: \t{}\n".format(datetime.datetime.now() - start_time))
except KeyboardInterrupt:
    pixels.fill((0, 0, 0))
    pixels.show()
    pass   
except Exception as e:
    print("Res now: {} x {}".format(vid_w,vid_h))
    print("Error: {}".format(e))


# After the loop release the cap object 
vid.release() 
# Destroy all the windows 
cv2.destroyAllWindows() 
