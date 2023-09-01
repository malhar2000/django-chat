from django.conf import settings
from django.db import models

# foreign key is a one to many relationship and goes to model with "many"


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        super(Category, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Server(models.Model):
    name = models.CharField(max_length=100)
    # a server can have one owner, but an owner can have many servers
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="server_owner", on_delete=models.CASCADE)
    # one to one with server category
    # one to many with category server
    category = models.ForeignKey(Category, related_name="server_category", on_delete=models.CASCADE)
    description = models.CharField(max_length=250, null=True)
    # one server can have many members, and a member can be in many servers
    member = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="server_member", blank=True)

    def __str__(self):
        return f"{self.name}-{self.id}"


# each server has multiple channels
class Channel(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="channel_owner", on_delete=models.CASCADE)
    topic = models.CharField(max_length=100, null=True)
    # one to one with channel server (one channel can only be in one server) (one server can have many channels)
    server = models.ForeignKey(Server, related_name="channel_server", on_delete=models.CASCADE)
    member = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="channel_member", blank=True)

    # override save method to make channel name lowercase and save it
    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        super(Channel, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
 