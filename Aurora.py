#Main Aurora python file, runs the webserver and the Aurora client, configs are loaded from extensions directory
import cherrypy
import os
import multiprocessing
import time
import json
import cherrypy
import configparser
import threading
import glob
import importlib
import inspect
import base64

from extensions import * #load all extensions


class AuroraManager:
    def __init__(self):
        self.config_file = "./config.ini"
        self.config = {} # config dict
        self.extensions = {} # extension dict
        self.extensions_dir = False 
        self.current_extension = False
        self.current_extension_name = False 
        self.screenshot_path = False

        #process config file
        self.loadConfig()

        #populate extensions
        self.populateExtensions()

        #grab the current extension
        self.current_extension = self.getCurrentExtension()

        


    #Load the config file
    def loadConfig(self):
        self.config = configparser.ConfigParser()
        self.config.optionxform = str
        self.config.read(self.config_file)

        #Lets load the enviroment variables
        for key,val in self.config["AURORA"].items():
            os.environ[key] = val

        #Setup extensions dir
        self.extensions_dir = self.config["EXTENSIONS"]["directory"]

        #Set default extension
        self.current_extension_name = self.config["EXTENSIONS"]["current_extension"]

        #set screenshotpath
        self.screenshot_path = self.config["GENERAL"]["screenshot_path"]
            
    #Get a particular extension
    def getExtensionClass(self,extension_name,extension_dir):
        module = importlib.import_module(extension_dir + "." + extension_name,package=extension_name)
            
        extensionClass = getattr(module,extension_name)
        x = extensionClass()
        print("Loaded: {} from ./{}/{}.py".format(x.Name,extension_dir,extension_name))
        return x

    #Populate all the extensions from the extensions class
    def populateExtensions(self):
        extension_dir = self.extensions_dir
        for file in glob.glob("./{}/*.py".format(extension_dir)):
            filename = os.path.splitext(os.path.basename(file))[0]
            
            # Ignore __ files
            if filename.startswith("__"):
                continue
        
            x = self.getExtensionClass(filename,extension_dir)
    
    #Get the current extension to be run
    def getCurrentExtension(self):
        os.environ["AURORA_CURRENT_EXTENSION_NAME"] = self.current_extension_name
        current_extension = self.getExtensionClass(self.current_extension_name,self.extensions_dir)
        self.current_extension = current_extension
        return current_extension

    def setCurrentExtension(self,new_current_extension):
        os.environ["AURORA_CURRENT_EXTENSION_NAME"] = new_current_extension
        current_extension = self.getExtensionClass(new_current_extension,self.extensions_dir)
        self.current_extension = current_extension
        return current_extension

    def takeScreenshot(self):
        print("TAKING SCREENSHOT")
        self.current_extension.takeScreenShot(self.screenshot_path)

    def loop(self):
        self.current_extension.visualise()


class Aurora_Webserver(object):
    def __init__(self,Manager):
        self.manager = Manager
        
    @cherrypy.expose
    def index(self):
        #return json.dumps(config)
        #os.environ["AURORA_CURRENT_EXTENSION"] = "normalExtension"
        self.manager.setCurrentExtension("normalExtension")
        return "Hello World!"
    
    def test(self):
        #return json.dumps(config)
        #os.environ["AURORA_CURRENT_EXTENSION"] = "normalExtension"
        self.manager.setCurrentExtension("exampleExtension")
        return "Hello World!"

    @cherrypy.expose
    def screenshot(self):
        #return json.dumps(config)
        #os.environ["AURORA_CURRENT_EXTENSION"] = "normalExtension"
        self.manager.takeScreenshot()
        with open(self.manager.screenshot_path, "rb") as img_file:
            jpeg_base64 = base64.b64encode(img_file.read())
        return """
            <html>
            <head>
            <title>Fruit Nutritional Information</title>
            </head>
            <html>
            <body>
            <img src="data:image/png;base64, %s" />
            </body>
            </html
            """ % (jpeg_base64.decode('utf-8'))
        

    

if __name__ == '__main__':
    #x = threading.Thread(target=thread_function, args=(1,), daemon=True)
    
    
    AuroraManager = AuroraManager()
    
    

    
    if(AuroraManager.config.getboolean('WEBSERVER', 'enabled') == True):
        cherrypy.config.update({'server.socket_port': 8080})
        cherrypy.tree.mount(Aurora_Webserver(AuroraManager), '/')
        cherrypy.engine.start()
    
    while(True):
        AuroraManager.loop()
        time.sleep(1)

    '''
    currentExtensionName = os.environ["AURORA_CURRENT_EXTENSION"]
    currentExtension = loadCurrentExtension(currentExtensionName)

    while(True):
        print("{}".format(os.environ["AURORA_CURRENT_EXTENSION"]))
        if(os.environ["AURORA_CURRENT_EXTENSION"] != currentExtensionName):
            #we changed to a diff thing
            print("WOW IT CHANGED")
            currentExtensionName = os.environ["AURORA_CURRENT_EXTENSION"]
            currentExtension = loadCurrentExtension(currentExtensionName)

        currentExtension.visualise()
    ''' 
    # do other work

   