[![Slack](https://img.shields.io/badge/slack-chat-green.svg)](https://join.slack.com/t/auroraambientlighting/shared_invite/zt-sib46ode-0rE3GqXFEcHd_H_y_nG~oA) 

![Aurora Example](https://github.com/AndrewMohawk/Aurora/raw/master/github/Aurora_Ambient_Light_test_video.gif)

# Aurora
Aurora is an ambient light system built with an HDMI switch, and HDMI capture card, a Raspberry Pi and an LED strip. There is a full writeup of how this came to be at https://www.andrewmohawk.com/2021/05/25/aurora-ambient-lighting/ and a build guide at https://www.andrewmohawk.com/2021/05/24/aurora-how-to-build/

# Help
Feel free to submit PRs for the project to improve the code base or add your own visualisations. Please remember to update the VERSION when you are doing a new PR. If you *need* help with any part of the project feel free to email or you can join the gitter at https://gitter.im/AuroraAmbientLighting/community 

# Extending
While the documentation for extending and building your own hasnt been fully written up, the TL;DR is to copy the example extenion in the `extensions` folder, change the metadata and restart Aurora with `sudo service aurora restart`, once it has picked up the new file you can simply make changes and then click load extension in the main interface. 

Please note when changing your `visualise` function you need to make it non-locking or the interface will not be able to communicate with it. The interface will pause for 0.01s before running visualise() again between each run

# Install
The install for this requires a hardware and software setup. You can follow the install guide at https://www.andrewmohawk.com/2021/05/24/aurora-how-to-build/ 

The flow diagram looks as follows:
![Aurora Flow diagram](https://www.andrewmohawk.com/wp-content/uploads/2021/05/Aurora-Flow-Diagram.png)

For just grabbing the software you can use this one liner:
```
wget https://raw.githubusercontent.com/AndrewMohawk/Aurora/master/install.sh -O - | sudo /bin/bash
```


