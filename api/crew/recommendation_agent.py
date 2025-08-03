import os

from crewai import Agent, Task, Crew, LLM
from crewai_tools import SerperDevTool, ScrapeWebsiteTool
from urllib.parse import quote_plus
from .models.places_output import PlacesOutput


class RecommendationAgent:
    def __init__(self, search_tool: SerperDevTool, scrapping_tool: ScrapeWebsiteTool):
        self.search_tool = search_tool
        self.scrapping_tool = scrapping_tool

    def get_maps_search_url(self, place: str, city: str) -> str:
        return "https://www.google.com/maps/search/?api=1&query=" + quote_plus(
            f"{place} {city} Egypt"
        )

    def generate_places_json(self, city: str, interests: str | list[str]):
        if isinstance(interests, str):
            interests = [i.strip() for i in interests.split(",") if i.strip()]

        # LLM configuration
        gemini_llm = LLM(
            model="gemini/gemini-1.5-flash",
            api_key=os.getenv("GEMINI_API_KEY", ""),
            temperature=0.3,
        )

        # Define the researcher agent with tools=[search_tool]
        researcher = Agent(
            role="Researcher",
            goal=(
                f"Find up to 10 tourist places and hidden gems in {city}, Egypt matching interests {interests}. "
                "You must use the provided search tool to fetch the latest information. You can also use the provided "
                "scrap information to help you research"
            ),
            backstory="You can fact-check using web searches, and return only JSON with 'name', 'type' and 'crowdness'.",
            llm=gemini_llm,
            tools=[self.search_tool, self.scrapping_tool],
        )

        research_task = Task(
            description=(
                f"Use web search as needed to gather up to 10 places. "
                "Return a JSON object with key 'places'. Each place must have exactly 'name', 'type' "
                "('mainstream' or 'hidden gem') and crowdness('not crowded', 'slightly crowded', 'crowded')."
            ),
            expected_output="JSON matching the PlacesOutput schema.",
            agent=researcher,
            output_json=PlacesOutput,
            tools=[self.search_tool, self.scrapping_tool],
        )

        output = Crew(agents=[researcher], tasks=[research_task]).kickoff()

        # Post-process JSON, inject maps links
        places = output.json_dict.get("places", [])
        for p in places:
            p["link"] = self.get_maps_search_url(p["name"], city)

        return places
