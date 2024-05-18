from rest_framework import generics, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, UserSerializer, PatientSerializer, BrainTumorPredictionSerializer, DiabetesPredictionSerializer
from django.contrib.auth import get_user_model
from .models import Patient, BrainTumorPrediction, DiabetesPrediction
from .permissions import IsDoctor
from .utils import preprocess_image , preprocess_data # Import the preprocessing function if needed
import numpy as np
import joblib
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

class BrainTumorPredictionViewSet(viewsets.ModelViewSet):
    queryset = BrainTumorPrediction.objects.all()
    serializer_class = BrainTumorPredictionSerializer

class DiabetesPredictionViewSet(viewsets.ModelViewSet):
    queryset = DiabetesPrediction.objects.all()
    serializer_class = DiabetesPredictionSerializer

class BrainTumorPredictionView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request, *args, **kwargs):
        # Load your Keras model
        model = tf.keras.models.load_model('ML_model/best_model_fine_tuned_InceptionV3.h5')  # Adjust path as needed

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
        prediction, _ = BrainTumorPrediction.objects.update_or_create(
            user=request.user,
            patient=patient,
            defaults={'score': prediction_score[0][prediction_class_index[0]], 'prediction_class': prediction_class_name}
        )

        # Return the prediction
        return Response({'prediction': prediction_class_name, 'score': float(prediction.score)}, status=status.HTTP_200_OK)


class DiabetesPredictionView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request, *args, **kwargs):
        # Collect data from the request
        data = request.data
        user = request.user

        # Validate and process the input data
        age = int(data.get('age'))
        hypertension = data.get('hypertension') == 'true'
        heart_disease = data.get('heart_disease') == 'true'
        bmi = float(data.get('bmi'))
        HbA1c_level = float(data.get('HbA1c_level'))
        blood_glucose_level = float(data.get('blood_glucose_level'))
        gender = data.get('gender')
        smoking_history = data.get('smoking_history')

        # Preprocess the data
        input_data = preprocess_data(age, hypertension, heart_disease, bmi, HbA1c_level, blood_glucose_level, gender, smoking_history)

        # Load the diabetes prediction model
        model = joblib.load('ML_model/best_model_diabetes.pkl')

        # Make prediction
        prediction_probabilities = model.predict_proba(input_data)
        prediction = model.predict(input_data)

        # Get the probability of the predicted class
        prediction_probability = prediction_probabilities[0][prediction[0]]

        # Get or create the patient
        patient_name = data.get('patient_name')
        patient, created = Patient.objects.get_or_create(
            name=patient_name,
            defaults={'age': age}
        )

        if not created:
            patient.age = age
            patient.save()

        # Create or update prediction record
        diabetes_prediction, _ = DiabetesPrediction.objects.update_or_create(
            user=user,
            patient=patient,
            defaults={
                'age': age,
                'hypertension': hypertension,
                'heart_disease': heart_disease,
                'bmi': bmi,
                'HbA1c_level': HbA1c_level,
                'blood_glucose_level': blood_glucose_level,
                'gender': gender,
                'smoking_history': smoking_history,
                'diabetes': prediction[0]  # Assuming the model returns a binary prediction
            }
        )

        return Response({
            'diabetes': prediction[0],
            'probability': prediction_probability
        }, status=200)
    

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {
            "message": "This is a protected view",
            "user": str(request.user),
            "email": request.user.email,
        }
        return Response(data)