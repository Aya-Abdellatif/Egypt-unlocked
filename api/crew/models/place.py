from pydantic import BaseModel


class Place(BaseModel):
    """Represents a place with metadata used in the application."""

    name: str
    type: str
    link: str
    crowdness: str
