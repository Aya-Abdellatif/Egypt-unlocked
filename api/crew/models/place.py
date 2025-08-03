from pydantic import BaseModel


class Place(BaseModel):
    name: str
    type: str
    link: str
    crowdness: str
