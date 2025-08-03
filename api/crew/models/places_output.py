from pydantic import BaseModel
from .place import Place


class PlacesOutput(BaseModel):
    places: list[Place]
