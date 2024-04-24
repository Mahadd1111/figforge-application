from treelib import Tree
import json
from matplotlib import pyplot as plt
import re

# Read Json Data from file
def read_json_data(filename):
    file = open(filename)
    design_data = json.load(file)
    return design_data

def find_dynamic_component(name):
    if 'button' in name.lower():
        return 'button'
    elif 'inputbox' in name.lower():
        return 'inputbox'
    else:
        return None

# Convert Json to a tree Structure
def save_in_structure(responsive,design_tree,json_data, parent_id=None):
    node_id = clean_id(responsive,json_data.get("id"))
    name = json_data.get("name")
    structure_type=""
    if 'type' in json_data:
        if find_dynamic_component(name) == 'inputbox':
            structure_type ='INPUT'
        elif find_dynamic_component(name) == 'button':
            structure_type='BUTTON'
        else:
            structure_type = json_data.get("type")
    additional_properties = {}
    for key, value in json_data.items():
        if key not in ["id", "name", "type", "children"]:
            additional_properties[key] = value
    node_data = {
        "id": node_id,
        "name": name,
        "structure_type": structure_type,
        "style":additional_properties
    }
    design_tree.create_node(tag=node_id, identifier=node_id, parent=parent_id,data = node_data)
    children = json_data.get("children")
    if children:
        for child in children:
            save_in_structure(responsive,design_tree, child, parent_id=node_id)

def clean_id(responsive,original_id):
    cleaned_id = original_id.replace(':', '_').replace(';', '_')
    if responsive=="desktop":
        cleaned_id = 'id_d_' + cleaned_id
    elif responsive=="tablet":
        cleaned_id = 'id_t_' + cleaned_id
    else:
        cleaned_id = 'id_m_' + cleaned_id
    return cleaned_id

