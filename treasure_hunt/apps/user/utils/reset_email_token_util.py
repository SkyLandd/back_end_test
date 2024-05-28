import random
import string


def reset_email_token(length=100, otp=None):
    if otp:
        return random.randint(100000, 999999)
    return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits + string.ascii_lowercase) for _ in range(length))
