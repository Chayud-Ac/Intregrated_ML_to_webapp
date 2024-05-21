from django.contrib.auth.models import AbstractUser, Group, Permission # type: ignore
from django.db import models # type: ignore

class User(AbstractUser):
    '''
    Create User model to store in database. groups field is relation to group table by group id in group table
    user_permissions relate to permission table by (permission_id)
    create role file (Doctor , Admin)
    

    '''
    ROLE_CHOICES = (
        ('doctor', 'Doctor'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_groups',  # Changed related_name to avoid clash
        blank=True,
        help_text=('The groups this user belongs to. A user will get all permissions '
                   'granted to each of their groups.'),
        related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',  # Changed related_name to avoid clash
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='custom_user',
    )


class Patient(models.Model):
    name = models.CharField(max_length=255, unique=True)
    age = models.IntegerField()
    medical_history = models.TextField()

class BrainTumorPrediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    score = models.FloatField()
    prediction_class = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    image_path = models.CharField(max_length=255)

class DiabetesPrediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)

    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]

    SMOKING_HISTORY_CHOICES = [
        ('No Info', 'No Info'),
        ('current', 'current'),
        ('ever', 'ever'),
        ('former', 'former'),
        ('never', 'never'),
        ('not current', 'not current'),
    ]
    
    gender = models.CharField(max_length=10 , choices=GENDER_CHOICES)
    age = models.IntegerField()
    hypertension = models.BooleanField()
    heart_disease = models.BooleanField()
    smoking_history = models.CharField(max_length=255, choices=SMOKING_HISTORY_CHOICES)
    bmi = models.FloatField()
    HbA1c_level = models.FloatField()
    blood_glucose_level = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    prediction_probability = models.FloatField()
    diabetes_prediction = models.CharField(max_length=255)