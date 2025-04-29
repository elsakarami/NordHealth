from rest_framework import serializers
from .models import Brewery


class BrewerySerializer(serializers.ModelSerializer):
    """Serializer for Brewery model."""
    class Meta:
        model = Brewery
        fields = '__all__'
        read_only_fields = ('id',)