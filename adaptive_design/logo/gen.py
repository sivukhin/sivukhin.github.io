#!/usr/bin/python3

import random
import svgwrite as sv
from svgwrite import cm, mm

def rgb2hex(r, g, b):
    return '#{:02x}{:02x}{:02x}'.format(r, g, b)

draw = sv.Drawing('logo.svg', profile='tiny')

cnt = 30
x, y = 100, 100
base_r = 50
r, g, b, a = 50, 50, 150, 100
for i in range(cnt):
    shift_x = random.randint(-30, 30)
    shift_y = random.randint(-30, 30)
    shift_r = random.randint(-20, 20)
    r += random.randint(-5, 5)
    g += random.randint(-5, 5)
    b += random.randint(-5, 5)
    a += random.randint(-5, 5)
    draw.add(draw.circle(center=(x + shift_x, y + shift_y), r=base_r + shift_r, stroke=rgb2hex(r, g, b), fill='none',
        stroke_width=random.randint(1, 4)))

draw.save()
