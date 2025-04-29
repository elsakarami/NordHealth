from rest_framework import serializers

class SignupSerializer(serializers.Serializer):
    """Serializer for user signup."""
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)

    def validate_password(self, value: str) -> str:
        """Validate that the password is not too simple."""
        if value.isnumeric():
            raise serializers.ValidationError("Password cannot be entirely numeric.")
        return value
