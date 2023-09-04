import os

from django.core.exceptions import ValidationError
from PIL import Image


def validate_icon_image_size(image):
    if image:
        with Image.open(image) as img:
            width, height = img.size
            # if the image is larger than 70x70, raise a validation error
            if width > 70 or height > 70:
                raise ValidationError("Image must be 70x70 or less")


def validate_image_file_exstension(value):
    # get a tuple of the file name 0 and the extension 1
    ext = os.path.splitext(value.name)[1]
    valid_extensions = [".jpg", ".jpeg", ".png", ".gif"]
    if not ext.lower() in valid_extensions:
        raise ValidationError("Unsupported file extension")
