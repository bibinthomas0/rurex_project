from django.db import models

class Fan(models.Model):
    speed = models.PositiveIntegerField(default=0)
    status = models.BooleanField(default=False)
    

class FanLogDetails(models.Model):
    change = models.CharField(max_length=30)
    status = models.BooleanField()
    speed_level = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)