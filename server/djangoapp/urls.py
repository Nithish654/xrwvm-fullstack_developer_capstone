from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'

urlpatterns = [

    path('register', views.register_user, name='register'),
    path('login', views.login_user, name='login'),
    path('logout', views.logout_user, name='logout'),
    path('getuser', views.get_user, name='getuser'),
    path('get_cars', views.get_cars, name='get_cars'),

    # 🚗 Dealers
    path('get_dealers', views.get_dealers),
    path('get_dealers/<str:state>', views.get_dealers),
    path('dealer/<int:dealer_id>', views.get_dealer),
    path('reviews/<int:dealer_id>', views.get_dealer_reviews),
    path('add_review', views.add_review),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
