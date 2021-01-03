import board
import neopixel
import time
from random import randint

numPixels = 300
pixels = neopixel.NeoPixel(board.D18, numPixels, auto_write=False)

FPSTime = time.time()
framespersecond_count = 0
while True:
    for i in range(numPixels):
        pixels[i] = (randint(0, 255), randint(0, 255), randint(0, 255))
    pixels.show()

    framespersecond_count += 1
    end = time.time() - FPSTime
    if end >= 1:
        print("--- FPS: {} ---".format(framespersecond_count))
        FPSTime = time.time()
        framespersecond_count = 0
