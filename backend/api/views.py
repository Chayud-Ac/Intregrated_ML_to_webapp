from rest_framework import generics, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, UserSerializer, PatientSerializer, PredictionSerializer
from django.contrib.auth import get_user_model
from .models import Patient, Prediction
from .permissions import IsDoctor
from .utils import preprocess_image  # Import the preprocessing function
import numpy as np
import tensorflow as tf

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny] 

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class PredictionViewSet(viewsets.ModelViewSet):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer

class PredictionView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request, *args, **kwargs):
        # Load your Keras model
        model = tf.keras.models.load_model('ML_model/trained_model.h5')  # Adjust path as needed

        # Check if image file is provided
        if 'image_file' not in request.FILES:
            return Response({'error': 'Image file is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Get data from the request
        patient_name = request.data.get('patient_name')
        age = request.data.get('age')
        medical_history = request.data.get('medical_history')
        image_file = request.FILES['image_file']

        # Preprocess the image
        input_data = preprocess_image(image_file)

        # Make prediction
        prediction_score = model.predict(input_data)
        prediction_class_index = np.argmax(prediction_score, axis=1)  # Get the class with the highest probability
        classes = ['Cyst', 'Normal', 'Stone', 'Tumor']
        prediction_class_name = classes[prediction_class_index[0]]  # Get the class name based on the index

        # Get or create the patient
        patient, created = Patient.objects.get_or_create(
            name=patient_name,
            defaults={'age': age, 'medical_history': medical_history}
        )

        if not created:
            patient.age = age
            patient.medical_history = medical_history
            patient.save()

        # Create or update prediction record
        prediction, _ = Prediction.objects.update_or_create(
            user=request.user,
            patient=patient,
            defaults={'score': prediction_score[0][prediction_class_index[0]], 'prediction_class': prediction_class_name}
        )

        # Return the prediction
        return Response({'prediction': prediction_class_name, 'score': float(prediction.score)}, status=status.HTTP_200_OK)
