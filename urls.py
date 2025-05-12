from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import scrape_hotels

urlpatterns = [
    path('', views.index, name='index'),
    path('planning/', views.planning, name='planning'),
    path('booking/', views.booking, name='booking'),
    path('guides/', views.guides, name='guides'),
    path('cultural/', views.cultural, name='cultural'),
    path('forum/', views.forum, name='forum'),
    path('couch/', views.couch, name='couch'),
    path('expense/', views.expense, name='expense'),
    path('profile/', views.profile, name='profile'),
    path('login/', views.login_view, name='login'),
    path('signup/',views.signup,name='signup'),
    path('scrape-hotels/', scrape_hotels, name='scrape_hotels'),
    path('plan_trip/', views.plan_trip, name='plan_trip'),
    path('submit_trip/', views.submit_trip, name='submit_trip'),

]

# Static and media file handling
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)




