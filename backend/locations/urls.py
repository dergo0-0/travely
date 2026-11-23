from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import InterestingPlaceViewSet, LocationListView, RegisterView, SearchHistoryListView

router = DefaultRouter()
router.register('interesting-places', InterestingPlaceViewSet, basename='interesting-places')

urlpatterns = [
    path('', include(router.urls)),
    path('locations/', LocationListView.as_view(), name='locations'),
    path('search-history/', SearchHistoryListView.as_view(), name='search-history'),
    path('register/', RegisterView.as_view(), name='register'),
]
