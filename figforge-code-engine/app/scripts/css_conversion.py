from treelib import Tree
import json
from matplotlib import pyplot as plt
import re
from io import StringIO
responsive_mode="desktop"



def layout_css_properties(node):
    css_code = ""
    target = node.data["style"]["css"]
    for property_name, property_value in target.items():
        css_code += f'    {property_name.replace("_", "-")}: {property_value};\n'
    return css_code


def generate_media_query(responsive_mode):
    if responsive_mode == 'desktop':
        return "@media (min-width: 781px) {\n.mobile-screen, .tablet-screen {\n    display: none;\n}\n"
    elif responsive_mode == 'tablet':
        return "@media (min-width: 481px) and (max-width: 780px) {\n.mobile-screen, .desktop-screen {\n    display: none;\n}\n"
    elif responsive_mode == 'mobile':
        return "@media (max-width: 480px) {\n.desktop-screen, .tablet-screen {\n    display: none;\n}\n"
    else:
        return ""

def global_css(node_id, design_tree, css_file, responsive_mode, max_width):
    media_query = generate_media_query(responsive_mode)
    css_file.write(media_query)

    # Use a temporary buffer to store the content before scaling
    temp_buffer = StringIO()
    generate_css(node_id, design_tree, temp_buffer)
    scaled_content = scale_css_with_vw(temp_buffer.getvalue(), max_width)
    css_file.write(scaled_content)

    css_file.write("}\n")



def generate_css(node_id,design_tree, css_file):
    element_mapping = {
        'FRAME': 'div',
        'INSTANCE':'div',
        'TEXT': 'p',
        'BUTTON': 'button',
        'IMAGE':'img',
        'INPUT':'input'
    }
    node = design_tree.get_node(node_id)
    element_type = node.data['structure_type']
    print("Generating CSS for : ",node.data["id"])
    if element_type in element_mapping:
        css_file.write('{}#{} {{\n'.format(element_mapping[element_type], node_id))
        css_code = layout_css_properties(node)
        css_code = re.sub(r'line-height: [0-9.]+px\s*/\*\s*([0-9.]+)%\s*\*/;', r'line-height: \1%;', css_code)
        css_file.write(css_code)
        css_file.write('}\n\n')
    
    for child_id in node.fpointer:
        generate_css(child_id,design_tree, css_file)


def scale_css_with_vw(css_content, max_width):
    def scale_pixels(match):
        pixel_value = float(match.group(1))
        vw_value = (pixel_value / max_width) * 100
        return f"{vw_value}vw"
    
    def scale_padding(match):
        values = match.group(1).split()  # Split the padding values
        scaled_values = []
        for value in values:
            numeric_value = re.search(r'([0-9.]+)', value)
            if numeric_value:
                scaled_value = f"{(float(numeric_value.group(1)) / max_width) * 100}vw"
                scaled_values.append(scaled_value)
        return ' '.join(scaled_values)

    properties_to_scale = ['width','gap','font-size']
    for property_name in properties_to_scale:
        css_content = re.sub(fr'(?<!max-|min-){property_name}:\s*([0-9.]+)px', lambda match: f'{property_name}: {scale_pixels(match)}', css_content)

    css_content = re.sub(fr'padding:\s*([^;]+);', lambda match: f'padding: {scale_padding(match)};', css_content)

    css_content = re.sub(r'url\([^\)]+\)',"url('')",css_content)

    return css_content