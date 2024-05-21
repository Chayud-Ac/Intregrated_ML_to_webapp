from rest_framework import serializers # type: ignore
from django.contrib.auth import get_user_model # type: ignore
from rest_framework.validators import UniqueValidator # type: ignore
from django.contrib.auth.password_validation import validate_password # type: ignore
from .models import Patient, BrainTumorPrediction , DiabetesPrediction
from django.contrib.auth.models import Group # type: ignore

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'role')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])
        user.save()

        # Assign group based on role
        if user.role == 'doctor':
            healthcare_provider_group = Group.objects.get(name='HealthcareProvider')
            user.groups.add(healthcare_provider_group)

        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class BrainTumorPredictionSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    class Meta:
        model = BrainTumorPrediction
        fields = '__all__'


class DiabetesPredictionSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    class Meta:
        model = DiabetesPrediction
        fields = '__all__'