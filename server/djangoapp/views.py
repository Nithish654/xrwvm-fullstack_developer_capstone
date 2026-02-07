from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json
from django.views.decorators.csrf import csrf_exempt
import requests  # ✅ ADDED

# Get an instance of a logger
logger = logging.getLogger(__name__)


# 🔐 LOGIN
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({
                "userName": username,
                "status": "Authenticated"
            })
        else:
            return JsonResponse({
                "userName": username,
                "status": "Invalid credentials"
            }, status=401)

    return JsonResponse({"error": "POST request required"}, status=400)


# 🚪 LOGOUT
@csrf_exempt
def logout_user(request):
    if request.method == "POST":
        logout(request)
        return JsonResponse({"status": "Logged out"})
    return JsonResponse({"error": "POST request required"}, status=400)


# 📝 REGISTER
@csrf_exempt
def register_user(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("userName")
        password = data.get("password")
        email = data.get("email")

        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {"status": "User already exists"},
                status=400
            )

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )
        user.save()

        return JsonResponse({
            "status": "User created successfully",
            "userName": username
        })

    return JsonResponse({"error": "POST request required"}, status=400)


# 👤 GET CURRENT LOGGED IN USER
def get_user(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "userName": request.user.username,
            "authenticated": True
        })
    else:
        return JsonResponse({
            "authenticated": False
        })


# ==================================================
# 🚗 DEALER APIs (CONNECT TO NODE SERVER)
# ==================================================

# ✅ GET ALL DEALERS OR BY STATE
def get_dealers(request, state="All"):

    if state == "All":
        url = "http://localhost:3030/fetchDealers"
    else:
        url = f"http://localhost:3030/fetchDealers/{state}"

    try:
        response = requests.get(url)
        data = response.json()

        return JsonResponse({
            "status": 200,
            "dealers": data
        })

    except Exception as e:
        return JsonResponse({
            "status": 500,
            "error": str(e)
        })


# ✅ GET SINGLE DEALER
def get_dealer(request, dealer_id):

    url = f"http://localhost:3030/fetchDealer/{dealer_id}"

    try:
        response = requests.get(url)
        data = response.json()

        return JsonResponse({
            "status": 200,
            "dealer": data
        })

    except Exception as e:
        return JsonResponse({
            "status": 500,
            "error": str(e)
        })


# ✅ GET REVIEWS
def get_dealer_reviews(request, dealer_id):

    url = f"http://localhost:3030/fetchReviews/dealer/{dealer_id}"

    try:
        response = requests.get(url)
        data = response.json()

        return JsonResponse({
            "status": 200,
            "reviews": data
        })

    except Exception as e:
        return JsonResponse({
            "status": 500,
            "error": str(e)
        })


# ✅ ADD REVIEW
@csrf_exempt
def add_review(request):

    if request.method == "POST":
        try:
            response = requests.post(
                "http://localhost:3030/insert_review",
                json=json.loads(request.body)
            )

            return JsonResponse({"status": 200})

        except Exception as e:
            return JsonResponse({
                "status": 500,
                "error": str(e)
            })

    return JsonResponse({"error": "POST required"}, status=400)


# ✅ GET CARS (THIS WAS MISSING — VERY IMPORTANT)
def get_cars(request):

    try:
        # If you don't have real car API, return empty list safely
        return JsonResponse({
            "status": 200,
            "CarModels": []
        })

    except Exception as e:
        return JsonResponse({
            "status": 500,
            "error": str(e)
        })

# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
# def get_dealerships(request):
# ...


# Create a `get_dealer_reviews` view to render the reviews of a dealer
# def get_dealer_reviews(request,dealer_id):
# ...


# Create a `get_dealer_details` view to render the dealer details
# def get_dealer_details(request, dealer_id):
# ...


# Create a `add_review` view to submit a review
# def add_review(request):
# ...
