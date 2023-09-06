from django.conf import settings
from django.db import models
from django.dispatch import receiver
from django.shortcuts import get_object_or_404

from .validators import validate_icon_image_size, validate_image_file_exstension

# foreign key is a one to many relationship and goes to model with "many"


def server_icon_path(instance, filename):
    return f"server/{instance.id}/server_icon/{filename}"


def server_banner_path(instance, filename):
    return f"server/{instance.id}/server_banner/{filename}"


def category_icon_path(instance, filename):
    return f"category/{instance.id}/category_icon/{filename}"


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.FileField(upload_to=category_icon_path, blank=True, null=True)

    # save method will be called when a category is saved and updated
    def save(self, *args, **kwargs):
        # if the id already exists, then it is an update
        if self.id:
            existing = get_object_or_404(Category, id=self.id)
            # if the icon is different, then delete the old icon
            if existing.icon and self.icon and existing.icon != self.icon:
                existing.icon.delete(save=False)
        self.name = self.name.lower()
        super(Category, self).save(*args, **kwargs)

    # delete the icon when the category is deleted
    @receiver(models.signals.pre_delete, sender="server.Category")
    def delete_category_icon(sender, instance, **kwargs):
        # loop through all the fields in the model
        for field in instance._meta.fields:
            # if the field is the icon field
            if field.name == "icon":
                # get the file
                file = getattr(instance, field.name)
                if file:
                    # delete the file
                    # save=False --> do not save the model because it is already saved after this
                    file.delete(save=False)

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
    banner = models.ImageField(
        upload_to=server_banner_path, blank=True, null=True, validators=[validate_image_file_exstension]
    )
    icon = models.ImageField(
        upload_to=server_icon_path,
        blank=True,
        null=True,
        validators=[validate_icon_image_size, validate_image_file_exstension],
    )

    # TODO: code repeated from server model need to refactor to utils

    # save method will be called when a category is saved and updated
    def save(self, *args, **kwargs):
        # if the id already exists, then it is an update
        if self.id:
            existing = get_object_or_404(Server, id=self.id)
            # if the icon is different, then delete the old icon
            if existing.icon and self.icon and existing.icon != self.icon:
                existing.icon.delete(save=False)
            if existing.banner and self.banner and existing.banner != self.banner:
                existing.banner.delete(save=False)
        self.name = self.name.lower()
        super(Server, self).save(*args, **kwargs)

    # delete the icon when the category is deleted
    @receiver(models.signals.pre_delete, sender="server.Server")
    def delete_server_icon(sender, instance, **kwargs):
        # loop through all the fields in the model
        for field in instance._meta.fields:
            # if the field is the icon field
            if field.name == "icon" or field.name == "banner":
                # get the file
                file = getattr(instance, field.name)
                if file:
                    # delete the file
                    # save=False --> do not save the model because it is already saved after this
                    file.delete(save=False)

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

    def __str__(self):
        return self.name
