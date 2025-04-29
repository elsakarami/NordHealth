import requests
from collections import Counter
from typing import Optional, List, Dict, Any
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class BreweryAPIClient:
    """Client to interact with the Open Brewery DB API."""
    BASE_URL = 'https://api.openbrewerydb.org/v1/breweries'

    @staticmethod
    def fetch_breweries(params: Optional[Dict[str, Any]] = None) -> Optional[List[Dict[str, Any]]]:
        try:
            response = requests.get(BreweryAPIClient.BASE_URL, params=params or {}, timeout=5)
            response.raise_for_status()
            return response.json()
        except requests.RequestException:
            return None


class BreweryBaseAPIView(APIView):
    """Base API view with common functionality for Brewery APIs."""
    permission_classes = [IsAuthenticated]

    def get_breweries(self, params: Optional[Dict[str, Any]] = None) -> Optional[List[Dict[str, Any]]]:
        return BreweryAPIClient.fetch_breweries(params=params)

    def service_unavailable_response(self) -> Response:
        return Response(
            {"error": "Failed to fetch breweries."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )


class BreweryListAPIView(BreweryBaseAPIView):
    """API view to list selected breweries"""

    def get(self, request, *args, **kwargs) -> Response:
        limit = request.query_params.get("limit", "200")
        params = {"per_page": limit}
        breweries = self.get_breweries(params)

        if breweries is None:
            return self.service_unavailable_response()

        return Response(breweries)


class BreweryGroupedByFieldAPIView(BreweryBaseAPIView):
    """API view to group breweries by a specific field"""

    def get(self, request, *args, **kwargs) -> Response:
        group_by_field = request.query_params.get('group_by')
        limit = request.query_params.get("limit", "200")

        if not group_by_field:
            return Response(
                {"error": "The 'group_by' query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        params = {"per_page": limit}
        breweries = self.get_breweries(params)

        if breweries is None:
            return self.service_unavailable_response()

        grouped_data = self.group_breweries_by_field(breweries, group_by_field)
        if not grouped_data:
            return Response(
                {"error": f"No data found for field '{group_by_field}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(grouped_data)

    @staticmethod
    def group_breweries_by_field(
        breweries: List[Dict[str, Any]],
        field: str
    ) -> Dict[str, int]:
        """Groups breweries by the specified field."""
        return dict(Counter(
            brewery.get(field) for brewery in breweries if brewery.get(field) is not None
        ))
