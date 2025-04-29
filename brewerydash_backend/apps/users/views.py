from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from apps.users.serializers import SignupSerializer
from apps.users.services import UserService

class SignupView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email, password = serializer.validated_data['email'], serializer.validated_data['password']

        try:
            user, token = UserService.signup(email, password)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "message": "User registered successfully",
            "user": {"id": user.id, "email": user.email},
            "token": token.key
        }, status=status.HTTP_201_CREATED)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        UserService.logout(request.user)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
