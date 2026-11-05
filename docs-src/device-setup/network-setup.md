# Network Setup

Set the WiFi network a board joins, and see its network state.

## Change WiFi over USB

1. On Home, click **Set up a new board**. This opens **System > Firmware**.
2. Plug the board in over USB and click **Connect Device**.
3. Choose **Change WiFi**.
4. Studio scans and lists the networks it finds.
5. Pick your network and enter the password.
6. The board connects and saves the settings, and Studio returns to the options screen.

Changing WiFi only updates the network settings. Run **Re-provision** if you also want a new certificate. See [Provisioning](provisioning.md).

The list shows each network's name (SSID), its signal strength in dBm, and a lock for networks that need a password. About -50 dBm is excellent, -70 is fair and -90 is weak.

## Networks > WiFi

With a board connected, open **Networks > WiFi** to see its WiFi state:

- **Wi-Fi Client Interface**: active or inactive, with MAC address, SSID, IP address, subnet mask, gateway, DNS server and signal strength.
- **Wi-Fi Access Point Interface**: active or inactive, with MAC address, SSID, IP address, subnet mask, gateway, DNS server and connected clients.

Other panels under **Networks** cover Ethernet, VPN, Bluetooth LE, WWAN, MQTT, Telephony, NTP and CAN. You can switch an interface on or off in **System > Settings** under **Network Interfaces**. See [Settings](../user-guide/settings.md).

## Troubleshooting

**The network doesn't appear**

- The network must broadcast its name. Hidden networks aren't listed.
- Move the board closer to the router.
- Go back and choose **Change WiFi** again to rescan.

**The connection fails**

- Check the password.
- Check for MAC filtering on your router.
- Use a 2.4 GHz network.

**The wrong network was saved**

Run **Change WiFi** again and pick another network.

## Related

- [Provisioning](provisioning.md)
- [Flashing Firmware](flashing-firmware.md)
- [Connection troubleshooting](../troubleshooting/connection.md)
