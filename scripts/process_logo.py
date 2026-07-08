"""Process MAAL logo assets — remove background and export PNGs."""
from PIL import Image
import os

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), '..'))
ASSETS = os.path.join(ROOT, 'assets')

# Default source: wordmark PNG with dark background (transparent after processing)
DEFAULT_SRC = os.path.join(
    ASSETS,
    'maal-logo-raw.png',
)


def remove_dark_bg(img, threshold=50):
    """Make near-black pixels transparent."""
    img = img.convert('RGBA')
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r < threshold and g < threshold and b < threshold:
                pixels[x, y] = (0, 0, 0, 0)
            elif (
                r < threshold + 20
                and g < threshold + 20
                and b < threshold + 20
                and max(r, g, b) - min(r, g, b) < 15
            ):
                pixels[x, y] = (0, 0, 0, 0)
    return img


def trim_transparent(img):
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img


def process_logo(src_path=DEFAULT_SRC):
    if not os.path.isfile(src_path):
        raise FileNotFoundError(f'Logo source not found: {src_path}')

    logo = trim_transparent(remove_dark_bg(Image.open(src_path)))

    nav_path = os.path.join(ASSETS, 'maal-logo-nav.png')
    footer_path = os.path.join(ASSETS, 'maal-logo.png')

    logo.save(nav_path, 'PNG')
    logo.save(footer_path, 'PNG')

    print('Saved', nav_path, logo.size)
    print('Saved', footer_path, logo.size)
    return logo


if __name__ == '__main__':
    process_logo()
    print('Done')
