from lib.AuroraExtension import AuroraExtension
import time
import datetime
import numpy as np
import pandas as pd 
import cv2

class Aurora_AutoCrop(AuroraExtension):
    def __init__(self):
        super().__init__()
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "Default Extension"
        self.Name="Default extension"
        self.count = 0
        self.current_frame = False

    def autocrop(self,image, threshold=0):
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

    def takeScreenShot(self,filepath):
        cv2.imwrite(filepath, self.current_frame) 
        return True

    def visualise(self):
        # Capture the video frame 
        ret, self.current_frame = self.getFrame()
        self.vid_h, self.vid_w, self.channels = self.current_frame.shape 
        
        crop_time = datetime.datetime.now()
        #print("Image dimensions pre-crop {} {}".format(self.vid_h,self.vid_w))
        self.current_frame = self.autocrop(self.current_frame)
        self.vid_h, self.vid_w, self.channels = self.current_frame.shape 
        #print("Crop Time: \t{}".format(datetime.datetime.now() - crop_time))
        
        #print("Image dimensions {} {}".format(vid_h,vid_w))
        if(self.vid_h <= 1 and self.vid_w <= 1):
            #print("Empty image {} {}".format(self.vid_h,self.vid_w))
            #print(ret)
            self.pixels.fill((0, 0, 0))
            self.pixels.show()
            return
        
        
        #cv2.imwrite("frame%d.jpg" % ret, frame) 
        #if(flipImage == True):
        #    frame = cv2.flip(frame,1)
        # img[y:y+h, x:x+w]
        
        

        widthPixels = int(self.vid_w * (percent/100)) + 1
        heightPixels = int(self.vid_h * (percent/100)) + 1

        

        cutTime = datetime.datetime.now()
        
        sectionTop = self.current_frame[0:heightPixels,0:vid_w]
        sectionBottom = self.current_frame[vid_h-heightPixels:vid_h,0:vid_w]
        
        sectionLeft = self.current_frame[0:vid_h,0:widthPixels]
        sectionRight = self.current_frame[0:vid_h,vid_w-widthPixels:vid_w]

        
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
            self.pixels[leftPixels - (startPoint + i)] = (R,G,B)
        #print(pixels)
        
        startPoint += leftPixels
        for i in range(topPixels):
            B,G,R = resizedTop[0][i]
            self.pixels[startPoint + i] = (R,G,B)
        
        startPoint += topPixels
        for i in range(rightPixels):
            B,G,R = resizedRight[i][0]
            self.pixels[startPoint + i] = (R,G,B)
        
        startPoint += rightPixels
        #print("starting at {} adding {} pixels".format(startPoint,bottomPixels))
        for i in range(bottomPixels):
            B,G,R = resizedBottom[0][i]
            self.pixels[startPoint + bottomPixels - i -1] = (R,G,B)
        '''
        print("Showing {} Pixels".format(len(pixels)))

        for x in range(10):
            print("Pixels {}: {}".format(x,pixels[x]))
        
        for x in range(290,300):
            print("Pixels {}: {}".format(x,pixels[x]))
        '''
        self.pixels.show()
        

        # if( showWindows ):
        #     cv2.imshow('TopPixels', cv2.resize(resizedTop,(600,5)))
        #     cv2.imshow('LeftPixels', cv2.resize(resizedLeft,(5,600)))
        #     cv2.imshow('RightPixels', cv2.resize(resizedRight,(5,600)))
        #     cv2.imshow('BottomPixels', cv2.resize(resizedBottom,(600,5)))
        #     cv2.imshow('Main Image', cv2.resize(frame,(360,240)))
            

        #     # the 'q' button is set as the 
        #     # quitting button you may use any 
        #     # desired button of your choice 
        #     if cv2.waitKey(1) & 0xFF == ord('q'): 
        #         return
        print("Total Time: \t{}\n".format(datetime.datetime.now() - start_time))
        
        
        #visualise!
        self.count += 1
        print("{} : {}".format(self.Name,self.count))