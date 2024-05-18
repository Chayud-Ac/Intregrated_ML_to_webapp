

from django.urls import path
from .views import RegisterView, UserDetailView, PatientViewSet, BrainTumorPredictionViewSet, DiabetesPredictionViewSet, BrainTumorPredictionView, DiabetesPredictionView, ProtectedView
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'brain_tumor_predictions', BrainTumorPredictionViewSet)
router.register(r'diabetes_predictions', DiabetesPredictionViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', UserDetailView.as_view(), name='user_detail'),
    path('predict_brain_tumor/', BrainTumorPredictionView.as_view(), name='predict_brain_tumor'),
    path('predict_diabetes/', DiabetesPredictionView.as_view(), name='predict_diabetes'),
    path('protected-endpoint/', ProtectedView.as_view(), name='protected-endpoint'),
    path('patients/', PatientViewSet.as_view({'get': 'list', 'post': 'create'}), name='patients'),
    path('predictions_brain_tumor/', BrainTumorPredictionViewSet.as_view({'get': 'list', 'post': 'create'}), name='predictions'),
    path('predictions_diabetes/', DiabetesPredictionViewSet.as_view({'get': 'list', 'post': 'create'}), name='predictions'),
]
