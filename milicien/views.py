from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.contrib.auth import logout
from django.http import HttpResponseRedirect  
import json

# Create your views here.
def index(request):
    return render(request,'index.html', {})

def login1(request):
   	return render(request,'login.html', {})


def register(request):
    return render(request,'register.html', {})

@login_required(login_url='/login/')
def home(request):
    return render(request,'user.html', {})


def findpsd(request):
    return render(request,'forgetpwd.html', {})

def learn(request):
    return render(request,'1min2ews.html', {})

def CheckName(request):
    username = request.POST['Username']
    dic={}
    dic['valid'] = False
    try:
        User.objects.get(username=username)
    except:
        dic['valid'] = True
    	
    jstr = json.dumps(dic)
    return HttpResponse(jstr, content_type='application/json')

def CheckPhone(request):
    username = request.POST['phone']
    dic={}
    dic['valid'] = False
    try:
        User.objects.get(last_name=phone)
    except:
        dic['valid'] = True
    	
    jstr = json.dumps(dic)
    return HttpResponse(jstr, content_type='application/json')


def test(request):
	dic={}
	dic[msg]=''
	jstr = json.dumps(dic)
	return HttpResponse(jstr, content_type='application/json')


def CheckMan(request):
    sms = request.POST['sms']
    dic={}
    dic['valid'] = False
    
    	
    jstr = json.dumps(dic)
    return HttpResponse(jstr, content_type='application/json')

def CheckEmail(request):
    email = request.POST['email']
    dic={}
    dic['valid'] = False
    try:
        User.objects.get(email=email)
    except:
        dic['valid'] = True
    	
    jstr = json.dumps(dic)
    return HttpResponse(jstr, content_type='application/json')

def LogMeIn(request):
    username = request.POST['UserName']
    password = request.POST['Password']
    user = authenticate(request, username=username,password=password)
    dic={}
    
    
    if user is not None:
        login(request, user)
        dic['success'] = True
        dic['msg'] = 'mmp'

    else:
    	dic['success'] = False
    	dic['msg'] = password

    jstr = json.dumps(dic)
    return HttpResponse(jstr, content_type='application/json')

def SignMeUp(request):
    username = request.POST['Username']
    password = request.POST['Password']
    email = request.POST['email']
    phone =	request.POST['phone']
    AmwayID =	request.POST['AmwayID']
    user = User.objects.create_user(username,email,password)
    user.first_name = AmwayID
    user.last_name = phone
    dic={}
    if user is not None:
        user.save()
        dic['success'] = True
        dic['msg'] = password

    else:
        dic['success'] = True
        dic['msg'] = username

    jstr = json.dumps(dic)
    return HttpResponse(jstr, content_type='application/json')



@login_required(login_url='/login/')
def logout_view(request):
    logout(request)
    # Redirect to a success page.
    return HttpResponseRedirect("/index/")