from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework.authtoken.models import Token
from apps.spam_detector.utils import predict_spam

User = get_user_model()


class UserService:
    @staticmethod
    def signup(email: str, password: str):
        if predict_spam(email):
            raise ValueError("This email is considered spam and cannot be used.")

        if User.objects.filter(email=email).exists():
            raise ValueError("Email already registered.")

        user = User.objects.create(
            email=email,
            password=make_password(password)
        )
        token, _ = Token.objects.get_or_create(user=user)
        return user, token

    @staticmethod
    def logout(user):
        if hasattr(user, 'auth_token'):
            user.auth_token.delete()