from rest_framework import serializers
from controls.models import Fan,FanLogDetails


class FanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fan
        fields = '__all__'
class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FanLogDetails
        fields = '__all__'