# forms.py
from django import forms
from .models import Trip

class TripForm(forms.ModelForm):
    class Meta:
        model = Trip
        fields = ['country', 'duration', 'companions', 'travel_mode', 'accommodation', 'purpose', 'season']
