# Description: Cache settings for the project
# Redis is used as the cache backend
# The default cache is used
# The cache key prefix is set to treasure_hunt
# The cache is stored in the redis server running on localhost on port 6379



CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'KEY_PREFIX': 'treasure_hunt'
    }
}
