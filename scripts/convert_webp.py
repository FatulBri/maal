"""Convert site PNG assets to WebP (keeps PNG as fallback)."""
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    raise SystemExit('Install Pillow: pip install Pillow')

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'assets'

USED_IMAGES = [
    'maal-logo-nav.png',
    'maal-logo.png',
    'falah-logo-mockup.png',
    'team-ceo-maryadi.png',
    'team-vceo-abib.png',
    'team-advisor-fajar.png',
    'team-cfo-humaira.png',
    'team-cto-ketut.png',
    'team-cro-farina.png',
    'team-cmo-adha.png',
    'og-image.png',
]


def convert(path: Path, quality: int = 85) -> Path:
    out = path.with_suffix('.webp')
    img = Image.open(path)
    if img.mode in ('RGBA', 'LA'):
        img.save(out, 'WEBP', quality=quality, method=6)
    else:
        img.convert('RGB').save(out, 'WEBP', quality=quality, method=6)
    return out


if __name__ == '__main__':
    for name in USED_IMAGES:
        src = ASSETS / name
        if not src.is_file():
            print('Skip (missing):', name)
            continue
        dst = convert(src)
        print(f'OK {dst.name} ({dst.stat().st_size // 1024} KB)')
