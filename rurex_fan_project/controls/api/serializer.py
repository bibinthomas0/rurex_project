from rest_framework import serializers
from controls.models import Fan


class FanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fan
        fields = '__all__'