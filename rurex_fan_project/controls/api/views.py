from controls.api.serializer import FanSerializer,LogSerializer
from rest_framework.views import APIView
from controls.models import Fan, FanLogDetails
from rest_framework.response import Response
from rest_framework import status,generics
from datetime import datetime


class FanDetailView(APIView):
    def __init__(self):
        try:
            Fan.objects.first()
        except:
            Fan.objects.create()

    def get(self, request):
        print("mmmm")
        data = Fan.objects.first()
        if not data:
            data = Fan.objects.create()
        print(data)
        serializer = FanSerializer(instance=data)
        return Response( status=status.HTTP_200_OK)

    def post(self, request):
        try:
            data = Fan.objects.first()
            print("hh")
            data.status = not data.status
            data.save()
            print("kk")
            if data.status:
                change = "Fan Oned"
            else:
                change = "Fan Offed"
            FanLogDetails.objects.create(
                change=change, status=data.status, speed_level=data.speed
            )
            serializer = FanSerializer(instance=data)
            print(serializer.data)
            return Response(
                data=serializer.data, status=status.HTTP_201_CREATED
            )
        except:
            return Response(
                {"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST
            )


class UpdateSpeed(APIView):
    def post(self, request):
        speed = request.data.get("speed_level")
        data = Fan.objects.first()
        if speed is not None:
            data.speed = speed
            data.save()
            FanLogDetails.objects.create(
                change="speed updated", status=data.status, speed_level=speed
            )
            serializer = FanSerializer(instance=data)
            return Response(
                data=serializer.data, status=status.HTTP_201_CREATED
            )
        else:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

class GetPowerdetails(APIView):
    def get(self, request):
        try:
            start_date_str = request.query_params.get("start_date")
            end_date_str = request.query_params.get("end_date")
            print(start_date_str, end_date_str)
            currents = {"1": 0.63, "2": 0.69, "3": 0.74, "4": 0.89, "5": 0.97}
            voltage = 220
            fan = Fan.objects.first()
            current = currents.get(str(fan.speed))
            power_factor = 0.8
            power = current * voltage * power_factor
            start_date = datetime.strptime(start_date_str, "%Y-%m-%dT%H:%M")
            end_date = datetime.strptime(end_date_str, "%Y-%m-%dT%H:%M")
            time_difference = end_date - start_date
            hours_difference = time_difference.total_seconds() / 3600

            energy = power * hours_difference
            data = {"power": power, "energy": energy}
            return Response(data=data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class GetLogs(generics.ListAPIView):
    queryset = FanLogDetails.objects.all()
    serializer_class = LogSerializer
