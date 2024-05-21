# backend/management/commands/create_groups_permissions.py

# backend/management/commands/create_groups_permissions.py

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission

class Command(BaseCommand):
    help = 'Create initial groups and assign permissions'

    def handle(self, *args, **kwargs):
        # Create Healthcare Provider group
        healthcare_provider_group, created = Group.objects.get_or_create(name='HealthcareProvider')

        # Define the codenames of the permissions to assign
        permission_codenames = [
            'add_braintumorprediction',
            'change_braintumorprediction',
            'delete_braintumorprediction',
            'view_braintumorprediction',
            'add_diabetesprediction',
            'change_diabetesprediction',
            'delete_diabetesprediction',
            'view_diabetesprediction',
        ]

        # Filter the permissions based on the codenames
        permissions = Permission.objects.filter(codename__in=permission_codenames)
        healthcare_provider_group.permissions.set(permissions)

        self.stdout.write(self.style.SUCCESS('Successfully created group and assigned permissions'))


