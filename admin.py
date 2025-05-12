from django.contrib import admin
from .models import Hotel, Room

class RoomInline(admin.TabularInline):
    model = Room
    extra = 1  # Allows adding extra rooms in admin

class HotelAdmin(admin.ModelAdmin):
    inlines = [RoomInline]

admin.site.register(Hotel, HotelAdmin)
admin.site.register(Room)
