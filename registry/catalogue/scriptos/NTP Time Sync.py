
# === START_CONFIG_PARAMETERS ===

dict(

    timeout         = 7,
    
    info = dict(
        name        = 'NTP Time Sync',
        version     = [1, 1, 1],
        category    = 'Network',
        description = ''' This tool synchronizes the UTC date and time from an NTP server.
                          You can choose the NTP server host to connect to and configure
                          your timezone to display the correct local time.
                      ''',
        author      = 'JC`zic',
        mail        = 'jczic.bos@gmail.com',
        www         = 'https://github.com/jczic'
    ),
    
    args = dict(

        ntp_srv = dict( label    = 'NTP server host:',
                        type     = str,
                        value    = 'pool.ntp.org' ),
        
        tz_offset = dict( label    = 'Timezone offset (hours from UTC):',
                          type     = float,
                          value    = 0.0 ),
        
        auto_detect = dict( label    = 'Auto-detect timezone from IP:',
                            type     = bool,
                            value    = False ),
        
        show_local = dict( label    = 'Show local time:',
                           type     = bool,
                           value    = True )
    
    )

)

# === END_CONFIG_PARAMETERS ===


import ntptime
from   time    import gmtime, localtime, mktime
from   network import WLAN, STA_IF

def _getUTCDateTime() :
    dt = gmtime()
    return (dt if dt[0] >= 2023 else None)

def _getLocalDateTime(tz_offset_hours) :
    """Calculate local time based on timezone offset"""
    dt = gmtime()
    if dt[0] < 2023:
        return None
    
    # Convert to timestamp and add offset
    timestamp = mktime(dt)
    offset_seconds = int(tz_offset_hours * 3600)
    local_timestamp = timestamp + offset_seconds
    
    # Convert back to time tuple
    return localtime(local_timestamp)

def _detectTimezoneOffset() :
    """Detect timezone offset using IP geolocation API"""
    try:
        import urequests as requests
    except:
        import requests
    
    print('Detecting timezone from IP address...')
    
    # Try multiple APIs in case one fails
    apis = [
        {
            'url': 'http://ip-api.com/json/?fields=offset,timezone',
            'parse': lambda d: (d.get('offset', 0) / 3600.0, d.get('timezone', 'Unknown'))
        },
        {
            'url': 'http://worldtimeapi.org/api/ip',
            'parse': lambda d: ((d.get('raw_offset', 0) + d.get('dst_offset', 0)) / 3600.0, d.get('timezone', 'Unknown'))
        }
    ]
    
    for api in apis:
        try:
            response = requests.get(api['url'], timeout=5)
            if response.status_code == 200:
                data = response.json()
                offset_hours, timezone = api['parse'](data)
                response.close()
                if offset_hours is not None:
                    tz_sign = '+' if offset_hours >= 0 else ''
                    print('Detected timezone: %s (UTC%s%.1f)' % (timezone, tz_sign, offset_hours))
                    return offset_hours
            response.close()
        except Exception as ex:
            print('  API failed: %s' % ex)
            continue
    
    print('All timezone detection attempts failed.')
    return None

if not args.ntp_srv or args.ntp_srv.find('.') == -1 :
    print('Please, enter a correct NTP server host.')
    import sys
    sys.exit()

# Auto-detect timezone if enabled
tz_offset = args.tz_offset
if args.auto_detect:
    detected = _detectTimezoneOffset()
    if detected is not None:
        tz_offset = detected
    else:
        print('Auto-detection failed, using manual offset: %.1f' % tz_offset)

ntptime.host = args.ntp_srv

try :
    ntptime.settime()
except Exception as ex :
    print('Unable to connect to NTP server "%s" (%s).' % (ntptime.host, ex))
    print('Make sure your ESP32 is connected to the Internet first.')
    import sys
    sys.exit()

dt = _getUTCDateTime()
if dt :
    print('Ok synchronized!')
    print('UTC date/time: %4d-%02d-%02d %02d:%02d:%02d' % (dt[0], dt[1], dt[2], dt[3], dt[4], dt[5]))
    
    if args.show_local :
        local_dt = _getLocalDateTime(tz_offset)
        if local_dt :
            tz_sign = '+' if tz_offset >= 0 else ''
            print('Local time (UTC%s%.1f): %4d-%02d-%02d %02d:%02d:%02d' % 
                  (tz_sign, tz_offset, 
                   local_dt[0], local_dt[1], local_dt[2], 
                   local_dt[3], local_dt[4], local_dt[5]))
else :
    print('Error in synchronizing the current UTC date/time.')
