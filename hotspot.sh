#!/bin/bash
echo "Starting du create hotspot"
# Install required packages
sudo apt update
sudo apt install hostapd dnsmasq -y

# Stop services before configuring
sudo systemctl stop hostapd
sudo systemctl stop dnsmasq

# Configure static IP address for the hotspot interface
sudo nmcli connection add type wifi con-name hotspot ifname wlan0 ssid "ADNA SERVICE"
sudo nmcli connection modify hotspot ipv4.addresses 172.24.1.1/24

# Configure hostapd
sudo tee /etc/hostapd/hostapd.conf > /dev/null <<EOL
interface=wlan0
driver=nl80211
ssid="ADNA SERVICE"
hw_mode=g
channel=6
ieee80211n=1
wmm_enabled=1
ht_capab=[HT40][SHORT-GI-20][SHORT-GI-40]
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=MyPassphrase
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
EOL

# Configure dnsmasq
sudo tee /etc/dnsmasq.d/hotspot.conf > /dev/null <<EOL
interface=wlan0
dhcp-range=172.24.1.2,172.24.1.10,255.255.255.0,12h
EOL

# Enable IP forwarding
sudo sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward

# Configure network interface
sudo iptables -t nat -A POSTROUTING -s 172.24.1.0/24 ! -d 172.24.1.0/24 -j MASQUERADE
sudo iptables -A FORWARD -o wlan0 -i eth0 -m conntrack --ctstate NEW -j ACCEPT
sudo iptables -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"

# Start services
sudo systemctl start hostapd
sudo systemctl start dnsmasq

# Enable services at boot
sudo systemctl enable hostapd
sudo systemctl enable dnsmasq

echo "Hotspot setup complete!"
