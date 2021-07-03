#!/bin/bash
echo -e "
 ▄▄▄       █    ██  ██▀███   ▒█████   ██▀███   ▄▄▄      
▒████▄     ██  ▓██▒▓██ ▒ ██▒▒██▒  ██▒▓██ ▒ ██▒▒████▄    
▒██  ▀█▄  ▓██  ▒██░▓██ ░▄█ ▒▒██░  ██▒▓██ ░▄█ ▒▒██  ▀█▄  
░██▄▄▄▄██ ▓▓█  ░██░▒██▀▀█▄  ▒██   ██░▒██▀▀█▄  ░██▄▄▄▄██ 
 ▓█   ▓██▒▒▒█████▓ ░██▓ ▒██▒░ ████▓▒░░██▓ ▒██▒ ▓█   ▓██▒
 ▒▒   ▓▒█░░▒▓▒ ▒ ▒ ░ ▒▓ ░▒▓░░ ▒░▒░▒░ ░ ▒▓ ░▒▓░ ▒▒   ▓▒█░
  ▒   ▒▒ ░░░▒░ ░ ░   ░▒ ░ ▒░  ░ ▒ ▒░   ░▒ ░ ▒░  ▒   ▒▒ ░
  ░   ▒    ░░░ ░ ░   ░░   ░ ░ ░ ░ ▒    ░░   ░   ░   ▒   
      ░  ░   ░        ░         ░ ░     ░           ░  ░
                -Update Script-
                @AndrewMohawk                                                        
"
INSTALLDIR="/opt/Aurora"
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root, please use sudo" 
   exit 1
fi

if [ ! -d "$INSTALLDIR" ] 
then
    echo "Directory $INSTALLDIR Does not exist. Please run install first or update the install directory" 
    exit 1
fi
cd $INSTALLDIR
if [ -d .git ]; then
    echo "[+] Git Cloning Aurora base"
    echo "------------------------------"
    git pull 
    echo "[+] Stopping Aurora"
    echo "------------------------------"
    service aurora stop 
    echo "[+] Service Status"
    echo "------------------------------"
    echo "Aurora status: `systemctl is-active aurora.service`"
    echo "[+] Starting Aurora"
    echo "------------------------------"
    service aurora start 
    echo "[+] Service Status"
    echo "------------------------------"
    echo "Aurora status: `systemctl is-active aurora.service`"
    echo "[+] Last 20 lines of aurora log"
    echo "------------------------------"
    journalctl -u aurora -n 20 --no-pager
    echo -e "
 ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ 
(___|___|___|___|___|___|___|___|___|___|___|___)
        "
    echo "Complete. You can now browse to the web interface to configure any changes you may need."
    localip=$(hostname -I)
    echo "This will likely be: http://$localip"

else
    echo "This install directory ($INSTALLDIR) is *NOT* a git repo."
fi;
