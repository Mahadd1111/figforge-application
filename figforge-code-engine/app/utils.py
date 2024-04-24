from .supabase_client import supabase
import json
from .scripts.script import *
from .scripts.react_conversion import *
from treelib import Tree
import os


def to_camel_case(name):
    cleaned_name = re.sub(r'[^a-zA-Z0-9_]', '_', name)
    words = re.split(r'[_\s]+', cleaned_name)
    camel_case_name = ''.join([word.capitalize() if i > 0 else word for i, word in enumerate(words)])
    return camel_case_name

def get_pages_data(project_id):
    response = supabase.table('page').select('*').eq('project_id', project_id).execute()
    res_json = json.loads(response.model_dump_json())['data']
    print(res_json)
    return res_json

def read_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    return content

def convert_to_code(project_id,user_id):

    # Get Maximum Width of the Project
    response = supabase.table('project').select('max_width').eq('id', project_id).eq('external_user_id', user_id).execute()
    res_json = json.loads(response.model_dump_json())['data'][0]['max_width']
    max_width = 1440
    if(res_json):
        max_width=res_json
    print('Max Width: ',max_width)


    # Get pages Data
    pages_data = get_pages_data(project_id)
    for page in pages_data:

        # Load the Data
        d_frame_data = json.loads(page["desktop_frame_data"]) if page["desktop_frame_data"] is not None else None
        t_frame_data = json.loads(page["tablet_frame_data"]) if page["tablet_frame_data"] is not None else None
        m_frame_data = json.loads(page["mobile_frame_data"]) if page["mobile_frame_data"] is not None else None
        d_external_data = json.loads(page["desktop_external_data"]) if page["desktop_external_data"] is not None else None
        t_external_data = json.loads(page["tablet_external_data"]) if page["tablet_external_data"] is not None else None
        m_external_data = json.loads(page["mobile_external_data"]) if page["mobile_external_data"] is not None else None

        # Save the data in a structured form
        desktop_tree,tablet_tree,mobile_tree = save_data_in_structure(d_frame_data,t_frame_data,m_frame_data)
        print(desktop_tree)

        # Convert to HTML
        convert_to_html(d_frame_data,desktop_tree,t_frame_data,tablet_tree,m_frame_data,mobile_tree, d_external_data,t_external_data,m_external_data)

        # Convert to CSS
        convert_to_css(max_width,d_frame_data,desktop_tree,t_frame_data,tablet_tree,m_frame_data,mobile_tree)

        # Convert to React
        component_name = to_camel_case(page["page_name"])
        convert_to_react(component_name)

        # Store Page Code in String
        curr_dir = os.path.dirname(os.path.realpath(__file__))
        css_dir = os.path.join(curr_dir, 'code','css','styles.css')
        react_dir = os.path.join(curr_dir, 'code','react','component.jsx')
        css_str = read_file(css_dir)
        react_str = read_file(react_dir)

        # Delete Existing Code Files for this page
        page_id = page["id"]
        data, count = supabase.table('code_file').delete().eq('project_id', project_id).eq('page_id', page_id).execute()

        # Upload Page's Code File to supabase
        data, count = supabase.table('code_file').insert({"file_path": f"/Project/{component_name}","content":f"{react_str}","framework":"React","project_id":project_id,"page_id":page_id,"style":f"{css_str}"}).execute()
    
    return {'status':f'OK'} 