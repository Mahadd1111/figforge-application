from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import get_pages_data,convert_to_code

@api_view(['GET'])
def hello_world(request):
    print("Hello World")
    return Response({'status': 'ok'})

@api_view(['POST','GET'])
def code_conversion(request):
    project_id = request.data.get('project_id')
    user_id = request.data.get('user_id')
    if project_id is None or user_id is None:
        return Response({'error': 'Missing project_id or user_id'}, status=400)
    result = convert_to_code(project_id, user_id)
    return Response(result)




