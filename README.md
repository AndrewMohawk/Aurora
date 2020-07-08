# Aurora
Aurora Ambient LED project

# Install
pip3 install -r requirements
sudo apt install libjasper1 libatlas-base-dev libqtgui4 libqt4-test

# Run
sudo LD_PRELOAD=/usr/lib/arm-linux-gnueabihf/libatomic.so.1 python3 pixelcam.py 
(or without the preload if the bug is fixed)

# Bugs
libatomic is currently not linked currectly in the latest version of openCV (at time of writing 4.1.1.26) so you may have to export

export LD_PRELOAD=/usr/lib/arm-linux-gnueabihf/libatomic.so.1
(bug from https://github.com/piwheels/packages/issues/59)