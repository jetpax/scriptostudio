"""
Scripto asset helpers.

Scriptos that ship with sidecar files (bitmaps, audio frames, VLW fonts, …)
should access them via `asset_dir(slug)` so the layout is consistent regardless
of how the Scripto was deployed. Studio deploys assets to:

    /scriptos/<slug>/<filename>

Typical usage from a Scripto:

    from lib.sys.scriptos import asset_dir
    with open(asset_dir('casio_watch') + '/casio_face.bin', 'rb') as f:
        face = f.read()

Or, inside a Scripto that knows its own slug via config.info.name:

    SLUG = 'casio_watch'
    FACE = asset_dir(SLUG) + '/casio_face.bin'
"""

ASSET_ROOT = '/scriptos'


def asset_dir(slug):
    """Return the on-device directory for a Scripto's sidecar assets."""
    return '%s/%s' % (ASSET_ROOT, slug)


def asset_path(slug, filename):
    """Return the full on-device path for a single sidecar asset."""
    return '%s/%s/%s' % (ASSET_ROOT, slug, filename)
