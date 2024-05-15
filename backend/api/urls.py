

from django.urls import path
from .views import RegisterView, UserDetailView, PredictionView, PatientViewSet, PredictionViewSet, ProtectedView
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'predictions', PredictionViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', UserDetailView.as_view(), name='user_detail'),
    path('predict/', PredictionView.as_view(), name='predict'),
    path('protected-endpoint/', ProtectedView.as_view(), name='protected-endpoint'),
    path('patients/', PatientViewSet.as_view({'get': 'list', 'post': 'create'}), name='patients'),
    path('predictions/', PredictionViewSet.as_view({'get': 'list', 'post': 'create'}), name='predictions'),
]
