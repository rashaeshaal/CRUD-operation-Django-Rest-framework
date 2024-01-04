from django.urls import path
from . import views
# from .views import MyTokenObtainPairView
from rest_framework_simplejwt import views as jwt_views
from .views import *

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    # path('',views.apiOverview),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('token/', jwt_views.TokenObtainPairView.as_view(), name ="token_obtain_pair"),
    # path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    # path('login', Loginview.as_view(), name="login"),
    path('me', UserView.as_view(), name="me"),
    path('register', RegisterView.as_view(), name="register"),
    path('upload_image',ImageUploadView.as_view(), name = "upload_image"),
    path('registered_users',RegisteredUserView.as_view(), name = "registered_users"),
    path('update/<int:id>', UpdateView.as_view(), name = "update"),
    path('api/block-user/<int:user_id>/', BlockUserView.as_view(), name='block_user'),
    path('api/unblock-user/<int:user_id>/', unblock_user.as_view(), name='unblock_user'),

    # path('logout', LogoutView.as_view(), name = "logout")
    # path('image/<int:pk>/', image_url, name='image_url'),
    
]