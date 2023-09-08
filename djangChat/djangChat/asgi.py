"""
ASGI config for djangChat project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djangChat.settings")

# need to have application init. loaded before importing urls
django_asgi_app = get_asgi_application()

# noqa isort:skip is used to skip the import check for the following line flake8
from . import urls  # noqa isort:skip

# application = get_asgi_application()
application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": URLRouter(urls.websocket_urlpatterns)
        # URLRouter just takes standard Django path() or url() entries.
        # Path-value pairs provided in the URL will be passed as kwargs to the consumer.
        # URLRouter will look for a path value in the URL like /ws/chat/room_name/
        # and, if it finds one, will call the consumer with the name argument set to room_name.
        # If no path is present, the connection will be rejected.
        # URLRouter will also reject connections if the path does not match any of the provided patterns.
        # The order of the patterns matters, just like in Django’s url() function.
        # The first pattern that matches will be used.
        # If no pattern matches, the connection will be rejected.
        # The URLRouter will also reject connections that do not have a valid path value.
        # The path value must be a valid Python identifier.
        # For example, /ws/chat/room%20name/ will be rejected because it contains a space.
        # The URLRouter will also reject connections that do not have a valid path value.
        # The path value must be a valid Python identifier.
    }
)
