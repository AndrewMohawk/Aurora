# import the opencv library 
import cv2 
import sys
#import numpy
import numpy as np
import math
import pandas as pd # Matrix operations

  
# define a video capture object 
vid = cv2.VideoCapture(0) 

# get image sizes
vid_w = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH))
vid_h = int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
print("Starting with feed of {} x {}".format(vid_w,vid_h))

#work out percentages to use for border
percent = 10
widthPixels = int(vid_w * (percent/100))
heightPixels = int(vid_h * (percent/100))

#Amount of pixels/LEDs
topPixels = 100 #pixels top
bottomPixels = 100 #pixels bottom
leftPixels = 50 #pixels Left
rightPixels = 50 #pixels right



while(True): 
      
    # Capture the video frame 
    ret, frame = vid.read() 
    frame = cv2.flip(frame,1)
    # img[y:y+h, x:x+w]
    sectionTop = frame[0:heightPixels,0:vid_w]
    sectionBottom = frame[vid_h-heightPixels:vid_h,0:vid_w]
    
    sectionLeft = frame[0:vid_h,0:widthPixels]
    sectionRight = frame[0:vid_h,vid_w-widthPixels:vid_w]


    # get shape
    h, w, c = sectionTop.shape
    hs = 1
    ws = topPixels
    
    # resize image using block averaging
    resizedTop = cv2.resize(sectionTop, (ws,hs), interpolation = cv2.INTER_AREA)
    resizedBottom = cv2.resize(sectionBottom, (ws,hs), interpolation = cv2.INTER_AREA)
    

    #get shape for sides
    h,w,c = sectionLeft.shape
    hs = leftPixels
    ws = 1
    
    resizedLeft = cv2.resize(sectionLeft, (ws,hs), interpolation = cv2.INTER_AREA)
    resizedRight = cv2.resize(sectionRight, (ws,hs), interpolation = cv2.INTER_AREA)

    cv2.imshow('TopPixels', cv2.resize(resizedTop,(600,5)))
    print(len(resizedTop[0]))
    cv2.imshow('LeftPixels', cv2.resize(resizedLeft,(5,600)))
    cv2.imshow('RightPixels', cv2.resize(resizedRight,(5,600)))
    cv2.imshow('BottomPixels', cv2.resize(resizedBottom,(600,5)))
    cv2.imshow('Main Image', cv2.resize(frame,(360,240)))
    #finalFrame = frame
    #finalFrame = cv2.resize(finalFrame, (360, 240))
    # cv2.imshow('Full image', finalFrame)
    #list(resized)
    # Display the resulting frame 
    # cv2.imshow('Full image', finalFrame)

    '''
    cv2.imshow("Resized image", resized)
    cv2.imshow("Full Image",frame)
    cv2.imshow("Top section",sectionTop)
    while(True):
        if cv2.waitKey(1) & 0xFF == ord('q'): 
            break
    #cv2.waitKey(0)
    cv2.destroyAllWindows()

    print(list(resized))
    sys.exit(1)
    '''
    '''
    #lets divide into blocks
    
    #topPixels
    
    topBlockSize = int(w / topPixels)
    topBlocks = []
    for x in range(0,topPixels):
        startX = int(x * topBlockSize)
        endX = startX + topBlockSize
        if(endX > w):
            endX = w
        #print("{} {}".format(startX,endX))
        tempBlock = sectionTop[0:heightPixels,startX:endX]
    #processIm(frame)
        #colors = get_dominant_color2(tempBlock)
        #print(colors)
    

    #colors = get_dominant_color2(frame)

    #Showing all main and side frames
    
    #lets build the main frame
    finalFrame = frame
    finalFrame = np.concatenate((sectionLeft,frame),axis=1)
    finalFrame = np.concatenate((finalFrame,sectionRight),axis=1)

    BLUE = [255,255,255]
    sectionTop= cv2.copyMakeBorder(sectionTop.copy(),0,0,widthPixels,widthPixels,cv2.BORDER_CONSTANT,value=BLUE)
    sectionBottom= cv2.copyMakeBorder(sectionBottom.copy(),0,0,widthPixels,widthPixels,cv2.BORDER_CONSTANT,value=BLUE)
    finalFrame = np.concatenate((sectionTop,finalFrame),axis=0)
    finalFrame = np.concatenate((finalFrame,sectionBottom),axis=0)
    
    finalFrame = frame
    finalFrame = cv2.resize(finalFrame, (960, 600))
    # Display the resulting frame 
    cv2.imshow('frame', finalFrame)
    '''

    # the 'q' button is set as the 
    # quitting button you may use any 
    # desired button of your choice 
    if cv2.waitKey(1) & 0xFF == ord('q'): 
        break
  
# After the loop release the cap object 
vid.release() 
# Destroy all the windows 
cv2.destroyAllWindows() 