"""Generate OG share image (1200x630) for maal.id."""
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    raise SystemExit('Install Pillow: pip install Pillow')

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'og-image.png'
LOGO = ROOT / 'assets' / 'maal-logo-nav.png'
ICON = ROOT / 'assets' / 'maal-icon.png'

W, H = 1200, 630

img = Image.new('RGB', (W, H), '#080C14')
draw = ImageDraw.Draw(img)

for i in range(H):
    t = i / H
    r = int(8 + (22 - 8) * (1 - t))
    g = int(12 + (36 - 12) * (1 - t))
    b = int(20 + (35 - 20) * (1 - t))
    draw.line([(0, i), (W, i)], fill=(r, g, b))

draw.ellipse((720, -120, 1280, 440), fill=(22, 196, 91, 40))
draw.ellipse((-80, 280, 480, 720), fill=(138, 217, 31, 30))

try:
    title_font = ImageFont.truetype('arialbd.ttf', 52)
    sub_font = ImageFont.truetype('arial.ttf', 28)
    tag_font = ImageFont.truetype('arial.ttf', 22)
except OSError:
    title_font = ImageFont.load_default()
    sub_font = ImageFont.load_default()
    tag_font = ImageFont.load_default()

draw.rounded_rectangle((64, 64, 280, 108), radius=22, fill=(22, 196, 91, 255))
draw.text((92, 78), 'PT MAAL', fill='#FFFFFF', font=tag_font)

draw.text((64, 160), 'Tumbuh Bersama,', fill='#F0F4F8', font=title_font)
draw.text((64, 230), 'Usaha Lebih Ringan.', fill='#16C45B', font=title_font)
draw.text((64, 330), 'Agregator merchant syariah untuk UMKM', fill='#8B9CB3', font=sub_font)
draw.text((64, 372), 'melalui aplikasi Falah.', fill='#8B9CB3', font=sub_font)

if LOGO.exists():
    logo = Image.open(LOGO).convert('RGBA')
    logo.thumbnail((420, 140), Image.Resampling.LANCZOS)
    img.paste(logo, (W - logo.width - 72, H - logo.height - 72), logo)
elif ICON.exists():
    icon = Image.open(ICON).convert('RGBA')
    icon.thumbnail((160, 160), Image.Resampling.LANCZOS)
    img.paste(icon, (W - icon.width - 72, H - icon.height - 72), icon)

OUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUT, 'PNG', optimize=True)
print(f'Saved {OUT}')
