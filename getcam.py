# import the opencv library
import cv2
import sys

# import numpy
import numpy as np
import math
import pandas as pd  # Matrix operations

import time

# define a video capture object
# vid = cv2.VideoCapture(0)
vid = cv2.VideoCapture("colourtest_from_youtube.mp4")

# get image sizes
vid_w = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH))
vid_h = int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
print("Starting with feed of {} x {}".format(vid_w, vid_h))

# work out percentages to use for border
percent = 10
widthPixels = int(vid_w * (percent / 100))
heightPixels = int(vid_h * (percent / 100))

# Amount of pixels/LEDs
topPixels = 100  # pixels top
bottomPixels = 100  # pixels bottom
leftPixels = 50  # pixels Left
rightPixels = 50  # pixels right

showWindows = True
FPSTime = time.time()
framespersecond_count = 0
while True:

    # Capture the video frame
    ret, frame = vid.read()
    frame = cv2.flip(frame, 1)
    print(frame)
    # img[y:y+h, x:x+w]
    sectionTop = frame[0:heightPixels, 0:vid_w]
    sectionBottom = frame[vid_h - heightPixels : vid_h, 0:vid_w]

    sectionLeft = frame[0:vid_h, 0:widthPixels]
    sectionRight = frame[0:vid_h, vid_w - widthPixels : vid_w]

    # get shape
    h, w, c = sectionTop.shape
    hs = 1
    ws = topPixels

    # resize image using block averaging
    resizedTop = cv2.resize(sectionTop, (ws, hs), interpolation=cv2.INTER_AREA)
    resizedBottom = cv2.resize(sectionBottom, (ws, hs), interpolation=cv2.INTER_AREA)

    # get shape for sides
    h, w, c = sectionLeft.shape
    hs = leftPixels
    ws = 1

    resizedLeft = cv2.resize(sectionLeft, (ws, hs), interpolation=cv2.INTER_AREA)
    resizedRight = cv2.resize(sectionRight, (ws, hs), interpolation=cv2.INTER_AREA)

    print(resizedLeft)
    # print(resizedTop[0][1][1])
    # print(resizedLeft[15][0])

    # Populate LEDs
    pixels = {}
    startPoint = 0
    for i in range(leftPixels):
        B, G, R = resizedLeft[i][0]
        pixels[startPoint + i] = (255 - R, 255 - G, 255 - B)

    startPoint += leftPixels
    for i in range(topPixels):
        B, G, R = resizedTop[0][i]
        pixels[startPoint + i] = (255 - R, 255 - G, 255 - B)

    startPoint += topPixels
    for i in range(rightPixels):
        B, G, R = resizedRight[i][0]
        pixels[startPoint + i] = (255 - R, 255 - G, 255 - B)

    startPoint += rightPixels
    for i in range(topPixels):
        B, G, R = resizedBottom[0][i]
        pixels[startPoint + i] = (255 - R, 255 - G, 255 - B)

    # print("Assigned {} Pixels".format(len(pixels)))
    print(resizedLeft)

    # Finished calculations
    framespersecond_count += 1
    end = time.time() - FPSTime
    if end >= 1:
        print("--- FPS: {} ---".format(framespersecond_count))
        FPSTime = time.time()
        framespersecond_count = 0

    if showWindows:
        cv2.imshow("TopPixels", cv2.resize(resizedTop, (600, 5)))
        cv2.imshow("LeftPixels", cv2.resize(resizedLeft, (5, 600)))
        cv2.imshow("RightPixels", cv2.resize(resizedRight, (5, 600)))
        cv2.imshow("BottomPixels", cv2.resize(resizedBottom, (600, 5)))
        cv2.imshow("Main Image", cv2.resize(frame, (360, 240)))

        # the 'q' button is set as the
        # quitting button you may use any
        # desired button of your choice
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

# After the loop release the cap object
vid.release()
# Destroy all the windows
cv2.destroyAllWindows()
