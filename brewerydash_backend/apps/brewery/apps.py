from django.apps import AppConfig


class BreweryConfig(AppConfig):
    """Configuration for the Brewery app."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.brewery'
    verbose_name = "Brewery"