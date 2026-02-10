"""
httpclient — Async HTTP client for pyDirect

Wraps C module primitives with cooperative async polling.
Use this from bg_tasks or any async context:

    from lib.httpclient import post, get
    r = await post('https://api.openai.com/v1/chat/completions',
                   data=json.dumps(payload),
                   headers={'Authorization': 'Bearer ...',
                            'Content-Type': 'application/json'})
    print(r['status'], r['body'])
"""

import httpclient as _c
import time

try:
    import asyncio
except:
    import uasyncio as asyncio


def _format_headers(headers):
    """Convert dict or string headers to 'Key:Value\\n' format for C module."""
    if headers is None:
        return None
    if isinstance(headers, str):
        return headers
    if isinstance(headers, dict):
        return '\n'.join(f'{k}:{v}' for k, v in headers.items())
    return None


async def request(url, *, method='GET', data=None, headers=None, timeout=10000):
    """
    Async HTTP/HTTPS request. Yields to event loop during I/O.

    Args:
        url: Full URL (http:// or https://)
        method: HTTP method (GET, POST, PUT, PATCH, DELETE)
        data: Request body (str or bytes)
        headers: Dict or 'Key:Value\\n' string
        timeout: Timeout in milliseconds

    Returns:
        dict with keys: status (int), body (str), headers (dict)

    Raises:
        OSError on network/timeout errors
    """
    hdrs = _format_headers(headers)
    h = _c._start(url, method=method, data=data, headers=hdrs, timeout=timeout)

    t0 = time.ticks_ms()
    # Allow extra grace period beyond the HTTP timeout for task cleanup
    deadline = timeout + 5000

    try:
        while True:
            r = _c._poll(h)
            if r is not None:
                return r
            if time.ticks_diff(time.ticks_ms(), t0) > deadline:
                _c._cancel(h)
                raise OSError("httpclient: response timeout")
            await asyncio.sleep_ms(10)
    except Exception:
        try:
            _c._cancel(h)
        except:
            pass
        raise


async def post(url, data=None, *, headers=None, timeout=10000):
    """Async HTTP POST."""
    return await request(url, method='POST', data=data,
                         headers=headers, timeout=timeout)


async def get(url, *, headers=None, timeout=10000):
    """Async HTTP GET."""
    return await request(url, method='GET', headers=headers, timeout=timeout)


async def put(url, data=None, *, headers=None, timeout=10000):
    """Async HTTP PUT."""
    return await request(url, method='PUT', data=data,
                         headers=headers, timeout=timeout)


async def delete(url, *, headers=None, timeout=10000):
    """Async HTTP DELETE."""
    return await request(url, method='DELETE', headers=headers, timeout=timeout)
