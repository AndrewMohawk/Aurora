from lib.AuroraExtension import AuroraExtension
import time

class normalExtension(AuroraExtension):
    def __init__(self):
        super().__init__()
        self.Author = "Andrew MacPherson (@AndrewMohawk)"
        self.Description = "Default Extension"
        self.Name="Default extension"
        self.count = 0

    def visualise(self):
        #visualise!
        self.count += 1
        print("{} : {}".format(self.Name,self.count))