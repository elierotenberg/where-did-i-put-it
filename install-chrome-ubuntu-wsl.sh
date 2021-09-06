#!/bin/sh

sudo apt update && sudo apt -y upgrade && sudo apt -y autoremove
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt -y install ./google-chrome-stable_current_amd64.deb
rm -rf google-chrome-stable_current_amd64.deb
google-chrome --version
