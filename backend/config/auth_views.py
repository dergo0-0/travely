from rest_framework_simplejwt.views import TokenObtainPairView

from .throttling import LoginRateThrottle


class RateLimitedTokenObtainPairView(TokenObtainPairView):
    throttle_classes = [LoginRateThrottle]
