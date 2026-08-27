#!/usr/bin/env python3
"""Regenera Assets/Iconos/sprite.svg con los iconos que usa el sitio.

Antes se cargaba Font Awesome entero desde un CDN (~110 KB de CSS más las
fuentes) para usar menos de 90 iconos. Ahora se sirve un sprite propio con solo
esos iconos, sin conexiones a terceros.

Cómo funciona: busca en el HTML todos los <use href="…/sprite.svg#nombre">,
saca ese icono del paquete oficial de Font Awesome y escribe el sprite.

Requiere npm (descarga el paquete la primera vez).
Uso: python3 _herramientas/construir-sprite.py

Para añadir un icono nuevo: escribe el <svg><use href="…#nombre"></svg> en la
página con el nombre del icono en Font Awesome y vuelve a ejecutar esto.
Los nombres antiguos (v5) valen: se resuelven con los alias del paquete.
"""
import json
import re
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
VERSION_FA = '6.5.1'
DESTINO = RAIZ / 'Assets/Iconos/sprite.svg'
# La familia solo importa para localizar el icono en el paquete de Font Awesome.
FAMILIAS = ('solid', 'brands', 'regular')


def descarga_fontawesome(tmp: Path) -> Path:
    paquete = f'@fortawesome/fontawesome-free@{VERSION_FA}'
    print(f'descargando {paquete}…')
    subprocess.run(['npm', 'pack', paquete], cwd=tmp, check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    tgz = next(tmp.glob('*.tgz'))
    with tarfile.open(tgz) as t:
        t.extractall(tmp, members=[m for m in t.getmembers()
                                   if m.name.startswith(('package/sprites', 'package/metadata'))])
    return tmp / 'package'


def iconos_usados() -> list:
    nombres = set()
    for p in RAIZ.rglob('*.html'):
        if any(x.startswith(('.', '_')) for x in p.relative_to(RAIZ).parts):
            continue
        nombres |= set(re.findall(r'sprite\.svg#([a-z0-9-]+)', p.read_text(encoding='utf-8')))
    return sorted(nombres)


def main() -> int:
    nombres = iconos_usados()
    if not nombres:
        print('no se ha encontrado ningún <use href="…/sprite.svg#…"> en el HTML')
        return 1

    with tempfile.TemporaryDirectory() as td:
        paquete = descarga_fontawesome(Path(td))

        alias = {}
        meta = json.loads((paquete / 'metadata/icon-families.json').read_text())
        for canonico, datos in meta.items():
            for a in (datos.get('aliases') or {}).get('names') or []:
                alias[a] = canonico

        simbolos = {}
        for familia in FAMILIAS:
            texto = (paquete / f'sprites/{familia}.svg').read_text()
            for m in re.finditer(r'<symbol id="([^"]+)" viewBox="([^"]+)">(.*?)</symbol>', texto, re.S):
                simbolos.setdefault(m.group(1), (m.group(2), m.group(3).strip()))

        piezas, faltan = [], []
        for nombre in nombres:
            datos = simbolos.get(nombre) or simbolos.get(alias.get(nombre, ''))
            if not datos:
                faltan.append(nombre)
                continue
            vb, cuerpo = datos
            piezas.append(f'<symbol id="{nombre}" viewBox="{vb}">{re.sub(r"\s+", " ", cuerpo)}</symbol>')

        if faltan:
            print('no existen en Font Awesome:', ', '.join(faltan))
            return 1

    DESTINO.parent.mkdir(exist_ok=True)
    DESTINO.write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n'
        f'<!-- Iconos: Font Awesome Free {VERSION_FA} (CC BY 4.0) - https://fontawesome.com/license/free\n'
        '     Generado por _herramientas/construir-sprite.py; no editar a mano. -->\n'
        + '\n'.join(piezas) + '\n</svg>\n', encoding='utf-8')
    print(f'{DESTINO.relative_to(RAIZ)}: {len(piezas)} iconos, {DESTINO.stat().st_size // 1024} KB')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
