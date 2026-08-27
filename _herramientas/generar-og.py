#!/usr/bin/env python3
"""Genera la imagen que se ve al compartir el sitio (og:image), 1200x630.

Antes se usaba el logo suelto: en WhatsApp y LinkedIn salía recortado y sin
contexto. Esta imagen usa los colores y la tipografía de la marca.

Requiere: pip install pillow fonttools brotli
Uso:      python3 _herramientas/generar-og.py
Salida:   Assets/Imagenes/og-satekor.png
"""
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont

RAIZ = Path(__file__).resolve().parent.parent
ANCHO, ALTO = 1200, 630

FONDO = (15, 23, 42)          # --color-background
VERDE = (0, 255, 170)         # --color-primary
VERDE_OSC = (0, 204, 136)     # --color-primary-darker
BLANCO = (248, 250, 252)      # --color-text-primary
GRIS = (148, 163, 184)        # --color-text-secondary

TITULAR = ['Telecomunicaciones', 'para empresas en Almería']
SUBTITULO = 'Fibra óptica · Videovigilancia · Redes · IoT'
PIE = 'satekor.es · Soporte 24/7 · 642 53 13 00'


def carga_fuente(peso, tam, tmp):
    """Poppins se guarda en woff2 (para la web); Pillow necesita ttf."""
    ttf = tmp / f'poppins-{peso}.ttf'
    if not ttf.exists():
        fuente = TTFont(RAIZ / f'Assets/Fuentes/poppins-{peso}-latin.woff2')
        fuente.flavor = None
        fuente.save(ttf)
    return ImageFont.truetype(str(ttf), tam)


def main():
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        img = Image.new('RGB', (ANCHO, ALTO), FONDO)
        d = ImageDraw.Draw(img)

        # Halo verde difuso en la esquina inferior derecha
        halo = Image.new('RGB', (ANCHO, ALTO), FONDO)
        hd = ImageDraw.Draw(halo)
        hd.ellipse([ANCHO - 340, ALTO - 300, ANCHO + 260, ALTO + 300], fill=(0, 60, 45))
        img = Image.blend(img, halo, 0.85)
        img = img.filter(__import__('PIL.ImageFilter', fromlist=['ImageFilter']).GaussianBlur(90))
        d = ImageDraw.Draw(img)

        # Franja superior con el degradado de la marca
        for x in range(ANCHO):
            t = x / ANCHO
            d.line([(x, 0), (x, 7)],
                   fill=tuple(int(VERDE_OSC[i] + (VERDE[i] - VERDE_OSC[i]) * t) for i in range(3)))

        # Logo
        logo = Image.open(RAIZ / 'Assets/Imagenes/logoB.webp').convert('RGBA')
        ancho_logo = 300
        logo = logo.resize((ancho_logo, round(logo.height * ancho_logo / logo.width)), Image.LANCZOS)
        img.paste(logo, (80, 78), logo)

        # Titular
        y = 232
        for i, linea in enumerate(TITULAR):
            f = carga_fuente(700 if i == 0 else 600, 66, tmp)
            d.text((80, y), linea, font=f, fill=BLANCO if i == 0 else VERDE)
            y += 84

        # Subtítulo
        d.text((80, y + 22), SUBTITULO, font=carga_fuente(400, 32, tmp), fill=GRIS)

        # Pie con barra de acento
        d.rectangle([80, ALTO - 96, 86, ALTO - 52], fill=VERDE)
        d.text((104, ALTO - 96), PIE, font=carga_fuente(600, 30, tmp), fill=BLANCO)

        destino = RAIZ / 'Assets/Imagenes/og-satekor.png'
        img.save(destino, optimize=True)
        print(f'{destino.relative_to(RAIZ)}  {destino.stat().st_size // 1024} KB  {img.size[0]}x{img.size[1]}')


if __name__ == '__main__':
    main()
