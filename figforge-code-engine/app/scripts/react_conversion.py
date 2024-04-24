from bs4 import BeautifulSoup
import os

def convert_html_to_react(html_content, component_name):
    soup = BeautifulSoup(html_content, 'html.parser')
    react_component = f"""
    "use client"
    import React from 'react';;
    import './styles.css'; // Import your stylesheet
    import {{ useState, useEffect }} from 'react';

    const {component_name} = () => {{
    
    const [inputValues, setInputValues] = useState({{
    }});


    const handleChange = (e, inputId) => {{
        const {{ value }} = e.target;
        setInputValues(prevState => ({{
            ...prevState,
            [inputId]: value
        }}));
    }};

    useEffect(() => {{
        console.log('Input values changed:', inputValues);
    }}, [inputValues]);


    return (
        {str(html_content)}
    );
    }};
    export default {component_name};
    """
    return react_component

def convert_to_react(component_name):
    curr_dir = os.path.dirname(os.path.realpath(__file__))
    html_file_path = os.path.join(curr_dir, '..', 'code','html','output.html')
    with open(html_file_path, 'r') as file:
        html_content = file.read()
    react_component = convert_html_to_react(html_content, component_name)
    output_file_path = os.path.join(curr_dir, '..', 'code','react','component.jsx')
    with open(output_file_path, 'w') as file:
        file.write(react_component)
    print(f"Conversion complete. Check {output_file_path} for the React component.")

