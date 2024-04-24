# app/urls.py
from django.urls import path
from .views import hello_world,code_conversion

urlpatterns = [
    path('hello-world/', hello_world, name='hello_world'),
    path('generate-code/',code_conversion, name='code_conversion'),
]
