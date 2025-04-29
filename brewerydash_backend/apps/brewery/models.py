from django.db import models

class Brewery(models.Model):
    """Model representing a brewery."""

    name = models.CharField(max_length=255)
    brewery_type = models.CharField(max_length=100)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = "Brewery"
        verbose_name_plural = "Breweries"
        ordering = ['name']

    def __str__(self) -> str:
        return self.name
