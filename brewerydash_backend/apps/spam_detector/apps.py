from django.apps import AppConfig

class SpamDetectorConfig(AppConfig):
    """Configuration for the Spam Detector app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.spam_detector'
    verbose_name = "Spam Detector"