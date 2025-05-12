from django.db import models

class Trip(models.Model):
    country = models.CharField(max_length=100)
    duration = models.IntegerField()
    companions = models.IntegerField()
    travel_mode = models.CharField(max_length=50)
    accommodation = models.CharField(max_length=50)
    purpose = models.CharField(max_length=50)
    season = models.CharField(max_length=50)

    def __str__(self):
        return f"Trip to {self.country} for {self.duration} days"

from django.db import models

class Hotel(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    star_rating = models.IntegerField()
    image = models.ImageField(upload_to='hotels/')

    def __str__(self):
        return self.name

class Room(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='rooms')
    room_type = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.room_type} - {self.hotel.name}"

from django.db import models

class Host(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='hosts/', default='default.jpg')
    contact = models.EmailField()

    def __str__(self):
        return self.name
