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
                -Install Script-
                @AndrewMohawk                                                        
"
INSTALLDIR="/opt/Aurora"
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root, please use sudo" 
   exit 1
fi

if [ -d "$INSTALLDIR" ] 
then
    echo "Directory $INSTALLDIR exists. Please remove before performing a clean install" 
    exit 1
fi
echo "[+] Creating Install Directory"
echo "------------------------------"
mkdir $INSTALLDIR
cd $INSTALLDIR
echo "[+] Updating APT and installing dependencies"
echo "------------------------------"
apt update
apt-get install -y libatlas-base-dev libportaudio2 python3-pip git python3-opencv
echo "[+] Git Cloning Aurora base"
echo "------------------------------"
git clone https://github.com/AndrewMohawk/Aurora.git .
cp config.ini.bak config.ini
echo "[+] Installing Python Requirements"
echo "------------------------------"
pip3 install -r requirements.txt
echo "[+] Installing Service"
echo "------------------------------"
cp aurora.service /etc/systemd/system
systemctl start aurora.service
echo "[+] Service Status"
echo "------------------------------"
echo "Aurora status: `systemctl is-active aurora.service`"
echo "[+] Last 20 lines of syslog"
echo "------------------------------"
sudo tail -n 20 /var/log/syslog
echo -e "
 ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ 
(___|___|___|___|___|___|___|___|___|___|___|___)
        "
echo "Complete. You can now browse to the web interface to configure any changes you may need."
localip=$(hostname -I)
echo "This will likely be: http://$localip"