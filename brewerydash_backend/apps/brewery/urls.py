from django.urls import path
from .views import BreweryGroupedByFieldAPIView,BreweryListAPIView

urlpatterns = [
    path('list/', BreweryListAPIView.as_view(), name='brewery-list'),
    path('grouped/', BreweryGroupedByFieldAPIView.as_view(), name='brewery-grouped-by-field'),
]