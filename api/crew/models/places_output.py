from pydantic import BaseModel
from .place import Place


class PlacesOutput(BaseModel):
    """Represents the output of the place generation"""

    places: list[Place]
