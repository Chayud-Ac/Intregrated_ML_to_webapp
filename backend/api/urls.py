

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, UserDetailView, PredictionView, PatientViewSet, PredictionViewSet

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'predictions', PredictionViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('predict/', PredictionView.as_view(), name='predict'),
    path('', include(router.urls)),
]

