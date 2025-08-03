import os
from typing import Any, Dict, List, Optional, Tuple, Union

import requests
from urllib.parse import quote_plus

from crewai import Agent, Task, Crew, LLM
from crewai_tools import SerperDevTool, ScrapeWebsiteTool
from .models.places_output import PlacesOutput


class RecommendationAgent:
    """Agent that researches and recommends places based on city and user interests."""

    def __init__(self, search_tool: SerperDevTool, scrapping_tool: ScrapeWebsiteTool):
        """Initialize the recommendation agent with required tools.

        Args:
            search_tool (SerperDevTool): Tool for performing web searches.
            scrapping_tool (ScrapeWebsiteTool): Tool for scraping website content.
        """
        self.search_tool = search_tool
        self.scrapping_tool = scrapping_tool

    def get_maps_search_url(self, place: str, city: str) -> str:
        """Build a Google Maps search URL for a place in a given city.

        Args:
            place (str): Name of the place.
            city (str): City where the place is located.

        Returns:
            str: URL to search the place on Google Maps.
        """
        return "https://www.google.com/maps/search/?api=1&query=" + quote_plus(
            f"{place} {city} Egypt"
        )

    def generate_places_json(
        self, city: str, interests: Union[str, List[str]]
    ) -> List[Dict[str, Any]]:
        """Generate a list of recommended places as JSON matching the PlacesOutput schema.

        The method uses an LLM-backed researcher agent with search and scraping tools to
        gather exactly 10 places (mainstream or hidden gems) and annotates each with a map link
        and latitude/longitude.

        Args:
            city (str): City to search in.
            interests (Union[str, List[str]]): Comma-separated or list of interest keywords.

        Returns:
            List[Dict[str, Any]]: List of place dictionaries enriched with 'link', 'lat', 'lng', and 'city'.
        """
        if isinstance(interests, str):
            interests = [i.strip() for i in interests.split(",") if i.strip()]

        # LLM configuration (avoid embedding real keys in source; use env/config)
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError(
                "Gemini API key not set in environment variable GEMINI_API_KEY."
            )

        gemini_llm = LLM(
            model="gemini/gemini-2.0-flash-lite",
            api_key=api_key,
            temperature=0.3,
        )

        # Define the researcher agent with tools
        researcher = Agent(
            role="Researcher",
            goal=(
                f"Find exactly 10 tourist places and hidden gems in {city}, Egypt matching interests {interests}. "
                "You must use the provided search tool to fetch the latest information. You can also use the provided "
                "scrapping tool to help you research"
            ),
            backstory="You can fact-check using web searches, and return only JSON with 'name', 'type' and 'crowdness'.",
            llm=gemini_llm,
            tools=[self.search_tool, self.scrapping_tool],
        )

        research_task = Task(
            description=(
                "Use web search as needed to gather exactly 10 places. "
                "Return a JSON object with key 'places'. Each place must have exactly 'name', 'type' "
                "('mainstream' or 'hidden gem') and crowdness('not crowded', 'slightly crowded', 'crowded')."
            ),
            expected_output="JSON matching the PlacesOutput schema.",
            agent=researcher,
            output_json=PlacesOutput,
            tools=[self.search_tool, self.scrapping_tool],
        )

        output = Crew(agents=[researcher], tasks=[research_task]).kickoff()

        # Post-process JSON, inject maps links and geolocation
        places = output.json_dict.get("places", [])
        for p in places:
            p["link"] = self.get_maps_search_url(p["name"], city)
            lat, lng = self.get_lat_lng(p["name"])
            p["lat"], p["lng"] = lat, lng
            p["city"] = city

        return places

    def get_lat_lng(self, place_name: str) -> Tuple[Optional[float], Optional[float]]:
        """Retrieve latitude and longitude for a place using LocationIQ.

        Args:
            place_name (str): Name of the place to geocode.

        Returns:
            Tuple[Optional[float], Optional[float]]: (latitude, longitude) if found; otherwise (None, None).
        """
        url = "https://us1.locationiq.com/v1/search.php"
        api_key = os.getenv("LOCIQ_API_KEY")
        if not api_key:
            # Missing API key; cannot resolve location
            return None, None

        params = {
            "key": api_key,
            "q": place_name,
            "format": "json",
            "limit": 1,
            "countrycodes": "eg",  # optional: limit to Egypt
        }

        try:
            resp = requests.get(url, params=params, timeout=5)
            resp.raise_for_status()
            data = resp.json()
            lat = float(data[0]["lat"])
            lng = float(data[0]["lon"])
            return lat, lng
        except Exception:
            return None, None
