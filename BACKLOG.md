# ScriptO Studio Backlog

Project-wide parking lot for non-urgent improvements and known issues.

---

## Extension Reconciliation Carries State Across Devices + Delete Doesn't Stick

**Priority:** Medium — confusing UX, but workaround is "live with the ghost extension".
**Symptom:** Flashed a fresh ESP32-S3-Touch-AMOLED-1.64 (waveshare_s3_amoled_1in64) and onboarded it via Studio. OpenInverter showed up in the device's extension list even though it had never been installed on this board. Deleting it from Studio's UI succeeds, but after a reboot the extension reappears. SmartGBW *was* intentionally installed on this device and works correctly; only OpenInverter is the ghost.
**Likely cause:** Two compounding bugs:
1. **Reconciliation pushes previous-device state to a fresh device.** Onboarding a new device appears to copy the "installed extensions" set from the most recently used device rather than starting empty. A board Studio has never met should not be brought to parity with another device's state.
2. **Delete leaves files on disk → re-discovery re-adds.** Deleting an extension from the UI evidently doesn't remove the `/lib/ext/<slug>/` tree on the device. On the next boot, something (autostart? extension index scanner?) sees the files and reinstates the registry entry.
**Repro:**
1. Have a device A with OpenInverter installed.
2. Flash + onboard a fresh device B (different hardware), do *not* install OpenInverter.
3. Observe OpenInverter in Studio's extension list for device B.
4. Delete from UI → confirm gone.
5. Reboot device B → OpenInverter back.
**Fix candidates:**
- Onboarding: treat unknown `device_id` as a fresh slate; do not seed installed-extensions from any other device.
- Delete: also remove `/lib/ext/<slug>/` and the matching `extensions.autostart` entry in `/settings/user_settings.json`. Verify on-device after the operation.
- Boot-time extension discovery: only register extensions that are present in the user's *registered* set for this device, not whatever happens to exist on disk.
**Acceptance:** A fresh device onboarded into a Studio account that has other devices with extensions installed boots with an empty extensions list. Deleting an extension removes both the registry entry and the on-disk files; reboot does not bring it back.

---
