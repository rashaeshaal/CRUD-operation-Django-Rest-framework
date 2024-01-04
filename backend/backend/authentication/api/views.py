from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import permissions, status
from rest_framework.views import APIView
from authentication.models import Account
from .serializers import UserRegisterSerializer, UserSerializer
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError
from rest_framework.exceptions import AuthenticationFailed
from django.shortcuts import get_object_or_404

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):

        print(user, "login side in server")
        token = super().get_token(user)

        # Add custom claims
        
        token['email'] = user.email
        token['name'] = user.name
        token['is_superuser'] = user.is_superuser
        print("serialissssss",user.image)
        # token['image'] = user.image


        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# @api_view(['GET'])
# def apiOverview(request):
#     api_urls = {
#         # admin-side
#         'account-list': '/user-list/',
#         # 'admin-user-create': '/user-create/',
#         'admin-user-delete': '/user-delete/',
#         'admin-user-update': '/user-update/',

#         # user-side
#         'user-create': '/user-create/',
#         'user-profile': '/user-profile/',
#         'user-add-img': '/user-add-img/',
#         'user-edit-img': '/user-edit-img/',
#     }
#     return Response(api_urls)

# class Loginview(APIView):
#     def post(self, request):
#         email = request.data["email"]
#         password = request.data["password"]
#         try:
#             user = Account.objects.get(email = email)
#         except Account.DoesNotExist:
#             raise AuthenticationFailed("Account does  not exist")
#         if user is None:
#             raise AuthenticationFailed("User does not exist")
#         if not user.check_password(password):
#             raise AuthenticationFailed("Incorrect Password")
#         access_token = AccessToken.for_user(user)
#         refresh_token =RefreshToken.for_user(user)
#         return Response({
#             "access_token" : access_token,
#             "refresh_token" : refresh_token
#         })

class RegisterView(APIView):
    def post(self, request):
        data = request.data
        print(data)
        serializer = UserRegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
#currently authenticated user
class UserView(APIView):
    print("gyjgkiui")
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ImageUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    print("image")
    def put(self, request, format=None):
        print('image uploaded', request)
        data = request.data["image"]
        print("upload",data)
        user = request.user
        user.image = data
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
class RegisteredUserView(APIView):
    permission_classes = [permissions.IsAdminUser]
    print('got to user getting api function')
    def get(self,request):
        user = Account.objects.exclude(is_superuser=True)
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)  
    
class UpdateView(APIView):
    permission_classes = [permissions.IsAdminUser]
    def post(self, request, id):
        user = Account.objects.get(id = id)
        user.name = request.data['name']
        user.email = request.data['email']
        user.save()
        return Response({"message": "success"}, status = status.HTTP_200_OK)

# Assume you have an API endpoint to handle user status updates
# This might be a simplified version
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, permissions
@api_view(['POST'])
@permission_classes([IsAuthenticated])

class BlockUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, id):
        try:
            user = Account.objects.get(id=id)
            user.is_blocked = not user.is_blocked
            user.save()
            return Response({"message": "success"}, status=status.HTTP_200_OK)
        except Account.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
def unblock_user(request, user_id):
    # Get the user making the request
    requesting_user = request.user

    # Check if the requesting user has the necessary permissions (you can customize this)
    if not requesting_user.is_staff:
        return JsonResponse({'error': 'You do not have permission to unblock users'}, status=403)

    # Get the user to be unblocked
    user_to_unblock = get_object_or_404(get_user_model(), id=user_id)

    # Your logic to unblock the user goes here
    # For example, you might update a field in the user model or perform other actions
    user_to_unblock.is_blocked = False
    user_to_unblock.save()

    return JsonResponse({'message': f'User {user_to_unblock.username} unblocked successfully'})
class TokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        # Check the user's status after a successful login
        user_id = self.user.id
        try:
            user = Account.objects.get(id=user_id)
            if user.is_blocked:
                # If the user is blocked, invalidate the token
                response.data['refresh'] = ''
                response.data['access'] = ''
                return response
        except Account.DoesNotExist:
            # Handle case where the user doesn't exist
            pass

        return response


# class LogoutView(APIView):
#     def post(self, request):
#         try:
#             refresh_token = request.data['refresh_token']
#             if refresh_token:
#                 token = RefreshToken(refresh_token)
#                 token.blacklist()
#             return Response("Logout Successful", status=status.HTTP_200_OK)
#         except TokenError:
#             raise AuthenticationFailed("Invalid Token")


