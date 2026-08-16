# Genera la imagen de previsualizacion (og:image) de Casa Kira.
# 1200x630, el formato que esperan WhatsApp, Facebook y compania.
# Reproduce el lockup del logo (public/assets/logo-casakira.svg) y el fondo del sitio:
# gris claro, cuadricula tenue y un degrade rojo subiendo desde el pie.
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 630
BG = (244, 244, 245)
ROJO = (193, 39, 45)
TINTA = (27, 27, 30)
GRID = (237, 237, 238)

base = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(base)

# Cuadricula, mismo paso proporcional que el sitio
for x in range(0, W, 60):
    d.line([(x, 0), (x, H)], fill=GRID, width=1)
for y in range(0, H, 60):
    d.line([(0, y), (W, y)], fill=GRID, width=1)

# Degrade rojo desde abajo: elipse difuminada sobre capa alfa.
# Tenue a proposito: acompana, no compite con el logo.
glow = Image.new("L", (W, H), 0)
gd = ImageDraw.Draw(glow)
gd.ellipse([-W * 0.35, H * 0.80, W * 1.35, H * 1.85], fill=52)
glow = glow.filter(ImageFilter.GaussianBlur(80))
base = Image.composite(Image.new("RGB", (W, H), ROJO), base, glow)

# --- Logo -------------------------------------------------------------------
# Proporciones del SVG (viewBox 0 0 212 70):
#   CASA  rotado -90, textLength 55.8, alto de fuente 22.6
#   KIRA  x=23.1 y=65, textLength 183, alto de fuente 88.2
FUENTE = r"C:\Windows\Fonts\ariblk.ttf"
# WhatsApp recorta la previsualizacion a un cuadrado centrado: todo lo que importe
# tiene que entrar en los 630 px centrales. 212 * 2.45 = 520 px, con margen.
ESCALA = 2.45
S = 6                 # supermuestreo para bordes limpios


def texto_estirado(txt, px_alto, ancho_objetivo):
    """Dibuja txt y lo estira al ancho exacto, como hace textLength en SVG."""
    f = ImageFont.truetype(FUENTE, int(px_alto * S))
    izq, arr, der, aba = f.getbbox(txt)
    capa = Image.new("RGBA", (der - izq + 8 * S, aba - arr + 8 * S), (0, 0, 0, 0))
    ImageDraw.Draw(capa).text(
        (4 * S - izq, 4 * S - arr), txt, font=f,
        fill=ROJO + (255,), stroke_width=int(2.4 * ESCALA * S / 2), stroke_fill=TINTA + (255,)
    )
    capa = capa.crop(capa.getbbox())
    prop = capa.height / capa.width
    ancho = int(ancho_objetivo)
    return capa.resize((ancho, int(ancho * prop)), Image.LANCZOS)


kira = texto_estirado("KIRA", 88.2 * ESCALA, 183 * ESCALA)
casa = texto_estirado("CASA", 22.6 * ESCALA, 55.8 * ESCALA).rotate(90, expand=True)

logo_w = int(212 * ESCALA)
logo_h = kira.height + 4
logo = Image.new("RGBA", (logo_w, logo_h), (0, 0, 0, 0))
logo.paste(casa, (0, logo_h - casa.height), casa)
logo.paste(kira, (int(23.1 * ESCALA), 0), kira)
logo = logo.crop(logo.getbbox())

lx = (W - logo.width) // 2
ly = int(H * 0.30)
base.paste(logo, (lx, ly), logo)

# --- Bajada -----------------------------------------------------------------
d = ImageDraw.Draw(base)
f_sub = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 30)
d.text((W // 2, ly + logo.height + 52), "MÁQUINAS DE COSER Y BORDAR",
       font=f_sub, fill=TINTA, anchor="mm")

f_pie = ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf", 25)
d.text((W // 2, ly + logo.height + 96), "Importador directo desde 1967",
       font=f_pie, fill=(96, 96, 102), anchor="mm")

base.save(r"C:\repos\casakira\public\assets\og-casakira.jpg", quality=92, optimize=True)
print("listo:", base.size)
