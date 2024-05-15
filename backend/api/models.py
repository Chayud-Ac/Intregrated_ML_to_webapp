from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):
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

class Prediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    score = models.FloatField()
    prediction_class = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)