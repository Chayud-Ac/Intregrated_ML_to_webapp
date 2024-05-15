from rest_framework.permissions import BasePermission

class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        # Check if the user is authenticated and has a doctor role
        return request.user.is_authenticated and request.user.role == 'doctor'
