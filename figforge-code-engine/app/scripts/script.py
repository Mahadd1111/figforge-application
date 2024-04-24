from treelib import Tree
import json
from matplotlib import pyplot as plt
import re
from .save_in_structure import *
from .html_conversion import *
from .css_conversion import *
import os

script_dir = os.path.dirname(os.path.realpath(__file__))
html_dir = os.path.join(script_dir, '..', 'code','html')
css_dir = os.path.join(script_dir, '..', 'code','css')

def save_data_in_structure(desktop_design_data,tablet_design_data,mobile_design_data):

    # Save in Data Structure
    if(desktop_design_data):
        desktop_design_tree = Tree()
        save_in_structure("desktop",desktop_design_tree,desktop_design_data,None)
    else:
        desktop_design_tree = None
    if(tablet_design_data):
        tablet_design_tree =Tree()
        save_in_structure("tablet",tablet_design_tree,tablet_design_data,None)
    else:
        tablet_design_tree = None
    if(mobile_design_data):
        mobile_design_tree = Tree()
        save_in_structure("mobile",mobile_design_tree,mobile_design_data,None)
    else:
        mobile_design_tree = None

    return desktop_design_tree,tablet_design_tree,mobile_design_tree


# Convert to html
def convert_to_html(desktop_design_data,desktop_design_tree,tablet_design_data,tablet_design_tree,mobile_design_data,mobile_design_tree, desktop_external_data, tablet_external_data ,mobile_external_data):
    with open(os.path.join(html_dir, 'output.html'), 'w') as html_file:
        # html_file.write('''<!DOCTYPE html>
        # <html lang="en">
        # <head>
        #     <meta charset="UTF-8">
        #     <meta name="viewport" content="width=device-width, initial-scale=1.0">
        #     <link rel="stylesheet" href="../css/styles.css">
        #     <title>Figma Design</title>
        # </head>
        # <body>\n''')
        html_file.write('<body>')
        if(desktop_design_data):
            html_file.write('<div class="desktop-screen">\n')
            translate_to_html(desktop_design_tree.root, desktop_design_tree, html_file,desktop_external_data)
            html_file.write('</div>\n')
        if(tablet_design_data):
            html_file.write('<div class="tablet-screen">\n')
            translate_to_html(tablet_design_tree.root, tablet_design_tree, html_file,tablet_external_data)
            html_file.write('</div>\n')
        if(mobile_design_data):
            html_file.write('<div class="mobile-screen">\n')
            translate_to_html(mobile_design_tree.root, mobile_design_tree, html_file,mobile_external_data)
            html_file.write('</div>\n')
        html_file.write('</body>\n')
        # html_file.write('</html>\n')
    print("Html Generated")


# Convert to CSS
def convert_to_css(mw,desktop_design_data,desktop_design_tree,tablet_design_data,tablet_design_tree,mobile_design_data,mobile_design_tree):
    with open(os.path.join(css_dir, 'styles.css'), 'w') as css_file:
        # Write global styles outside of media queries
        css_file.write("""
        * {
            box-sizing: border-box;
        }

        body, html {
            margin: 0;
            padding: 0;
        }
        """)

        # Generate CSS for each design tree
        if(desktop_design_data):
            max_width =mw
            global_css(desktop_design_tree.root, desktop_design_tree, css_file, 'desktop',max_width)
        if(tablet_design_data):
            max_width = 800
            global_css(tablet_design_tree.root, tablet_design_tree, css_file, 'tablet',max_width)
        if(mobile_design_data):
            max_width = 500
            global_css(mobile_design_tree.root, mobile_design_tree, css_file, 'mobile',max_width)
    
    print("Max_width is: ",mw)    
    print("CSS Generated")