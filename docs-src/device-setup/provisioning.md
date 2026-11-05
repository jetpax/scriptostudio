# Provisioning

Provisioning gives a board its HTTPS certificate and its password. A new board gets this automatically at the end of setup. You can also run it again on its own.

## What it does

- Generates a self-signed HTTPS certificate for `https://<hostname>.local`, where the hostname looks like `pybot-xxxx`.
- Restarts the board into setup mode, where it serves a password page.
- Sends you to Studio with the board's address filled in.

## New board

When you set up a new board, WiFi and the certificate happen back to back after the flash:

1. Studio saves your WiFi settings and the hostname, then generates and installs the certificate.
2. The board restarts on your network and serves its setup page.
3. A dialog, **Accept Security Warning**, offers to open the board. Click the button to open `https://<hostname>.local` in a new tab.
4. Your browser warns about the certificate. This is expected, because the certificate is self-signed. Choose **Advanced**, then **Proceed**. You do this once per browser.
5. The page redirects from `/setup` and asks for a password. Set one (at least 4 characters).
6. The board restarts and Studio opens with the connect dialog filled in with `wss://<hostname>/mcp`. Enter the password to connect.

## Re-provision

Use **Re-provision** in **System > Firmware** to:

- Renew an expired certificate.
- Make a certificate for a changed hostname.
- Start fresh with a new certificate and a new password.

Connect the board over USB, choose **Re-provision**, and follow the same steps as above from the security warning on. Your WiFi settings are kept.

## Forgot Credentials

Choose **Forgot Credentials** in **System > Firmware** with the board connected over USB. It shows the board's hostname and the WiFi network it's set to join. It doesn't show the password. If you've lost the password, run **Re-provision** to set a new one.

## Troubleshooting

**The board doesn't appear after the restart**

- Wait 10 to 15 seconds for it to join WiFi.
- If `.local` doesn't resolve, open the board by its IP address from your router's device list.

**The certificate warning keeps appearing**

- Make sure you chose **Proceed**.
- Run **Re-provision** to make a fresh certificate.

**You can't reach the board after provisioning**

- Check that it's on the same network as your computer.
- Check that the WiFi settings are right with **Forgot Credentials**.

## Related

- [Flashing Firmware](flashing-firmware.md)
- [Network Setup](network-setup.md)
- [Connection troubleshooting](../troubleshooting/connection.md)
