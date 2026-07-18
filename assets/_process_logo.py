#!/usr/bin/env python3.12
"""Separa as 3 versoes do logo Water Please, torna o fundo branco transparente
e auto-recorta. Gera versoes a cores e versoes a branco (para fundos escuros)."""
import numpy as np
from PIL import Image
import os

SRC = os.path.join(os.path.dirname(__file__), "logo-wp-1.png")
OUT = os.path.dirname(__file__)

img = Image.open(SRC).convert("RGB")
arr = np.asarray(img).astype(np.float32)
H, W, _ = arr.shape

def white_to_alpha(region):
    """Recupera o logo a cores com canal alfa (remove fundo branco)."""
    r = region.astype(np.float32)
    mn = r.min(axis=2)
    a = 255.0 - mn                      # branco -> 0 ; cor -> alto
    af = np.clip(a / 255.0, 1e-6, 1.0)
    # unmultiply contra branco
    out = (r - 255.0 * (1.0 - af[..., None])) / af[..., None]
    out = np.clip(out, 0, 255)
    rgba = np.dstack([out, a]).astype(np.uint8)
    return rgba

def to_white(rgba):
    """Mesma silhueta mas a branco solido (para fundos escuros)."""
    out = rgba.copy()
    out[..., 0:3] = 255
    return out

def autocrop(rgba, pad=20):
    a = rgba[..., 3]
    ys, xs = np.where(a > 10)
    if len(xs) == 0:
        return rgba
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, rgba.shape[1])
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, rgba.shape[0])
    return rgba[y0:y1, x0:x1]

def save(rgba, name):
    Image.fromarray(rgba, "RGBA").save(os.path.join(OUT, name))
    print("->", name, rgba.shape[1], "x", rgba.shape[0])

# Regioes (nao sobrepostas) na pagina A4 landscape
regions = {
    "logo-vertical":    arr[0:H,        0:1170],          # versao vertical (esquerda)
    "logo-horizontal":  arr[0:1240,     1170:W],          # horizontal compacta (topo dir.)
    "simbolo":          arr[0:1240,     0:1170],           # so o simbolo (topo esquerda)
}

for name, reg in regions.items():
    rgba = autocrop(white_to_alpha(reg))
    save(rgba, name + ".png")
    save(to_white(rgba), name + "-branco.png")

print("OK")
