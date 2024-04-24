from treelib import Tree
import json
from matplotlib import pyplot as plt
import re

def generate_svg(node):
    target = node.data["style"]
    if len(target["fillGeometry"])>0:
        fill_data = target["fillGeometry"][0]["data"]
    else:
        fill_data = ""
    if len(target['fills'])>0 and 'color' in target['fills'][0]:
        fill_color = target['fills'][0]['color']
        fill_rgb = f"rgb({int(fill_color['r'] * 255)},{int(fill_color['g'] * 255)},{int(fill_color['b'] * 255)})"
    else: 
        fill_rgb = ""
    stroke_align = target.get("strokeAlign", "OUTSIDE")
    stroke_cap = target.get("strokeCap", "NONE")
    stroke_join = target.get("strokeJoin", "MITER")
    stroke_miter_limit = target.get("strokeMiterLimit", 4)
    stroke_weight = target.get("strokeWeight", 1)
    svg_start =f'<svg width={target["width"]} height={target["height"]} xmlns="http://www.w3.org/2000/svg">'
    svg_end = '</svg>'
    svg_path = f'<path d="{fill_data}" fill="{fill_rgb}" stroke="{fill_rgb}" stroke-width="{stroke_weight}" stroke-linecap="{stroke_cap}" stroke-linejoin="{stroke_join}" />'
    return svg_start + svg_path + svg_end

def translate_to_html(node_id, design_tree, html_file,external_data, indent_level=3 ):
    node = design_tree.get_node(node_id)
    divs = ['FRAME', 'RECTANGLE', 'GROUP', 'ELLIPSE', 'INSTANCE']
    imgs = ['IMAGE', 'VECTOR']
    hrs = ['LINE']
    hs = ['TEXT']
    btns = ['BUTTON']
    inputs = ['INPUT']
    indentation = '  ' * indent_level

    if node.data['structure_type'] in inputs:
        # html_file.write('{}<input type="text" id="{}">\n'.format(indentation, node.data['id']))
        html_file.write(f"{indentation}<input type='text' id='{node.data['id']}' value={{inputValues['{node.data['id']}']}} onChange={{(e) => handleChange(e, '{node.data['id']}')}} />\n")
        # html_file.write(f"{indentation}<input type='text' id='{node.data['id']}' value=''/>\n")
    elif node.data['structure_type'] in btns:
        html_file.write('{}<button id="{}">\n'.format(indentation, node.data['id']))
    elif node.data['structure_type'] in divs:
        html_file.write('{}<div id="{}">\n'.format(indentation, node.data['id']))
    elif node.data['structure_type'] in hs:
        html_file.write('{}<p id="{}">{}</p>\n'.format(indentation, node.data['id'], node.data['name']))

    if not node.is_leaf():
        for child_id in node.fpointer:
            translate_to_html(child_id, design_tree, html_file,external_data,indent_level + 1)

    if node.data['structure_type'] in btns:
        html_file.write('{}</button>\n'.format(indentation))
    elif node.data['structure_type'] in divs:
        html_file.write('{}</div>\n'.format(indentation))

