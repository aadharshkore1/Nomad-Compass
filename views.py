from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, 'index.html')

def planning(request):
    return render(request, 'planning.html')

def booking(request):
    return render(request, 'booking.html')

def guides(request):
    return render(request, 'guides.html')

def cultural(request):
    return render(request, 'cultural.html')

def forum(request):
    return render(request, 'forum.html')

def couch(request):
    return render(request, 'couch.html')

def expense(request):
    return render(request, 'expense.html')

def profile(request):
    return render(request, 'profile.html')

from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, authenticate

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('index')  # redirect to a home page after login
    else:
        form = AuthenticationForm()

    return render(request, 'login.html')

def signup(request):
    return render(request,'signup.html')

import requests
from bs4 import BeautifulSoup
from django.http import JsonResponse

def scrape_hotels(request):
    location = request.GET.get('location', 'Delhi')  # Default location
    url = f"https://www.airbnb.co.in/"  # Replace with a real hotel site

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        hotels = []

        # Example: Modify selectors based on the actual website
        for hotel in soup.select(".hotel-card"):
            name = hotel.select_one(".hotel-name").text.strip()
            price = hotel.select_one(".price").text.strip()
            rating = hotel.select_one(".rating").text.strip()

            hotels.append({"name": name, "price": price, "rating": rating})

        return JsonResponse({"hotels": hotels})
    else:
        return JsonResponse({"error": "Failed to fetch hotels"}, status=500)

# views.py
from django.shortcuts import render, redirect
from .forms import TripForm
from .models import Trip

def plan_trip(request):
    if request.method == 'POST':
        form = TripForm(request.POST)
        if form.is_valid():
            # Calculate additional fields
            country = form.cleaned_data['country']
            duration = form.cleaned_data['duration']
            companions = form.cleaned_data['companions']
            accommodation = form.cleaned_data['accommodation']
            purpose = form.cleaned_data['purpose']
            season = form.cleaned_data['season']

            cost = 0
            budget_category = ''
            recommended_travel_mode = ''
            attractions = []

            # Logic to calculate travel cost, accommodation cost, extra cost, etc.
            travel_cost = calculate_travel_cost(duration, companions)
            accommodation_cost = calculate_accommodation_cost(accommodation, duration)
            extra_cost = calculate_extra_cost(purpose)

            cost = travel_cost + accommodation_cost + extra_cost
            budget_category = determine_budget_category(cost)
            recommended_travel_mode = recommend_travel_mode(season, duration)

            # Get attractions for the selected country
            attractions = get_country_attractions(country)

            # Save data to database
            trip = form.save(commit=False)
            trip.cost = cost
            trip.budget_category = budget_category
            trip.recommended_travel_mode = recommended_travel_mode
            trip.attractions = ', '.join(attractions)
            trip.save()

            return redirect('success')  # Redirect to a success page or another view

    else:
        form = TripForm()

    return render(request, 'planning.html', {'form': form})

def calculate_travel_cost(duration, companions):
    # Add your logic to calculate travel cost
    return 200 + (companions * 50) if duration <= 5 else 500 + (companions * 100)

def calculate_accommodation_cost(accommodation, duration):
    # Add your logic to calculate accommodation cost
    return 100 * duration if accommodation == 'Hotel' else 50 * duration

def calculate_extra_cost(purpose):
    # Add your logic for extra costs based on purpose
    return 200 if purpose == 'Business' else 100

def determine_budget_category(cost):
    # Determine the budget category based on the cost
    if cost < 600:
        return "Economy Budget"
    elif 600 <= cost < 2000:
        return "Mid-Range Budget"
    else:
        return "Luxury Budget"

def recommend_travel_mode(season, duration):
    # Recommend travel mode based on season and duration
    if season == "Winter" and duration > 7:
        return "Flight"
    elif season == "Summer" and duration <= 7:
        return "Train"
    else:
        return "Bus"

def get_country_attractions(country):
    # Get attractions based on country
    country_attractions = {
        'France': ["Eiffel Tower", "Louvre Museum"],
        'Germany': ["Brandenburg Gate", "Cologne Cathedral"]
        # Add more countries here
    }
    return country_attractions.get(country, ["Explore local hidden gems!"])



from django.shortcuts import render, redirect
from .models import Trip  # Import the Trip model

def submit_trip(request):
    if request.method == 'POST':
        # Get the form data
        country = request.POST.get('country')
        duration = request.POST.get('duration')
        companions = request.POST.get('companions')
        travel_mode = request.POST.get('travelMode')
        accommodation = request.POST.get('accommodation')
        purpose = request.POST.get('purpose')
        season = request.POST.get('season')

        # Save the data to the database
        new_trip = Trip(
            country=country,
            duration=duration,
            companions=companions,
            travel_mode=travel_mode,
            accommodation=accommodation,
            purpose=purpose,
            season=season
        )
        new_trip.save()

        return redirect('planning')  # Redirect back to the planning page or any other page

    return render(request, 'planning.html')

from django.shortcuts import render
from .models import Hotel

def booking_view(request):
    hotels = Hotel.objects.prefetch_related('rooms').all()
    return render(request, 'booking.html', {'hotels': hotels})

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Host
import json

# Get all hosts
def get_hosts(request):
    hosts = list(Host.objects.values())  # Convert QuerySet to list
    return JsonResponse({'hosts': hosts})

# Add a new host
@csrf_exempt  # Disable CSRF for simplicity (Use proper authentication in production)
def add_host(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_host = Host.objects.create(
            name=data['name'],
            location=data['location'],
            description=data['description'],
            image=data.get('image', 'default.jpg'),
            contact=data['contact']
        )
        return JsonResponse({'message': 'Host added successfully', 'id': new_host.id})
    return JsonResponse({'error': 'Invalid request'}, status=400)
