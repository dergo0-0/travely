from django.conf import settings
from django.db import models


class Location(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    description = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.name

class SearchHistory(models.Model):
    query = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='search_history',
    )

    def __str__(self):
        return self.query
