from django.db.models import Q
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.viewsets import ModelViewSet

from .models import Location, SearchHistory
from .serializers import LocationSerializer, RegisterSerializer, SearchHistorySerializer


class LocationListView(ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def list(self, request, *args, **kwargs):
        search = request.query_params.get('search', '').strip()
        if search:
            user = request.user if request.user.is_authenticated else None
            SearchHistory.objects.create(query=search, user=user)
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        search = self.request.query_params.get('search', '').strip()
        return Location.objects.filter(
            Q(name__icontains=search)
            | Q(city__icontains=search)
            | Q(country__icontains=search)
            | Q(category__icontains=search)
        )


class SearchHistoryListView(ListAPIView):
    serializer_class = SearchHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SearchHistory.objects.filter(user=self.request.user).order_by('-created_at')


class InterestingPlaceViewSet(ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    throttle_scope = 'register'
