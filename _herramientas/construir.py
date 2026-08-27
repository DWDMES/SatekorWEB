#!/usr/bin/env python3
"""Sincroniza los bloques comunes de todas las páginas desde _plantillas/.

El sitio sigue siendo estático y sin dependencias: esto no genera archivos
nuevos, solo reescribe *in situ* los trozos repetidos (cabecera, pie, banner de
cookies, botones flotantes y fuentes) para no tener que editarlos 25 veces.

Cada página delimita esos trozos con marcas HTML:

    <!-- @plantilla inicio: cabecera -->
    ...contenido generado, no editar a mano...
    <!-- @plantilla fin: cabecera -->

En las plantillas, {{BASE}} es el prefijo hasta la raíz del sitio ('' en la
raíz, '../' en subcarpetas y '/' en la 404, que puede servirse a cualquier
profundidad).

Uso:
    python3 _herramientas/construir.py              # reescribe lo que haga falta
    python3 _herramientas/construir.py --verificar  # solo comprueba (código 1 si algo está desfasado)
"""
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PLANTILLAS = RAIZ / '_plantillas'


def prefijo_base(pagina: Path) -> str:
    rel = pagina.relative_to(RAIZ)
    if rel.name == '404.html':
        return '/'
    return '../' * (len(rel.parts) - 1)


def paginas():
    for p in sorted(RAIZ.rglob('*.html')):
        if any(parte.startswith(('.', '_')) for parte in p.relative_to(RAIZ).parts):
            continue
        yield p


def render(nombre: str, base: str) -> str:
    return (PLANTILLAS / f'{nombre}.html').read_text(encoding='utf-8').replace('{{BASE}}', base)


def procesar(texto: str, base: str, avisos: list) -> str:
    def sustituye(m):
        nombre = m.group('nombre')
        if not (PLANTILLAS / f'{nombre}.html').exists():
            avisos.append(f'no existe la plantilla «{nombre}»')
            return m.group(0)
        return (f'<!-- @plantilla inicio: {nombre} -->\n'
                f'{render(nombre, base)}'
                f'    <!-- @plantilla fin: {nombre} -->')

    patron = re.compile(
        r'<!-- @plantilla inicio: (?P<nombre>[a-z-]+) -->.*?<!-- @plantilla fin: (?P=nombre) -->',
        re.S)
    return patron.sub(sustituye, texto)


def main() -> int:
    verificar = '--verificar' in sys.argv
    desfasadas, avisos = [], []

    for pagina in paginas():
        actual = pagina.read_text(encoding='utf-8')
        nuevo = procesar(actual, prefijo_base(pagina), avisos)
        if nuevo == actual:
            continue
        desfasadas.append(pagina.relative_to(RAIZ))
        if not verificar:
            pagina.write_text(nuevo, encoding='utf-8')

    for aviso in dict.fromkeys(avisos):
        print(f'aviso: {aviso}')

    if verificar:
        if desfasadas:
            print(f'{len(desfasadas)} página(s) sin sincronizar con _plantillas/:')
            for p in desfasadas:
                print(f'  - {p}')
            print('\nEjecuta: python3 _herramientas/construir.py')
            return 1
        print('Todas las páginas están sincronizadas con _plantillas/.')
        return 0

    if desfasadas:
        print(f'{len(desfasadas)} página(s) actualizadas:')
        for p in desfasadas:
            print(f'  - {p}')
    else:
        print('Nada que actualizar.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
