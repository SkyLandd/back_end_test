from django.urls import path
from apps.user.views import (
    RegistrationView, ForgetPasswordView,
    UserDetailView, ChangePasswordView, EmailExistAPIView,
    ResetPasswordAPIView, AccountStatusAPIView, AccountActivationAPIView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,

)

urlpatterns = [
    path('register/', RegistrationView.as_view(), name='register'),
    # path('google/login/', GoogleLoginView.as_view(), name='google-login'),

    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login-refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify-token/', TokenVerifyView.as_view(), name='verify-token'),
    path('account-activation/<secret_key>', AccountActivationAPIView.as_view(),
         name='account-activation'),
    path('reset-password/', ResetPasswordAPIView.as_view(), name='reset-password'),
    path('email-exist/', EmailExistAPIView.as_view(), name='email-exist'),
    path('account-status/', AccountStatusAPIView.as_view(), name='account-status'),
    path('forget-password/', ForgetPasswordView.as_view(), name='forget-password'),
    path('me/', UserDetailView.as_view(), name='user'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

]
