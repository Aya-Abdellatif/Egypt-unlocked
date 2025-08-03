import requests
from datetime import datetime

FOURSQUARE_API_KEY = "YOUR_API_KEY"  # set securely
HEADERS = {"Authorization": FOURSQUARE_API_KEY}
SEARCH_URL = "https://api.foursquare.com/v3/places/search"
DETAILS_URL_TEMPLATE = "https://api.foursquare.com/v3/places/{fsq_id}"

def get_place_fsq_id(name: str, near: str = None, ll: str = None, limit=1):
    params = {"query": name, "limit": limit}
    if near:
        params["near"] = near
    if ll:  # latitude,longitude string
        params["ll"] = ll
    resp = requests.get(SEARCH_URL, headers=HEADERS, params=params)
    resp.raise_for_status()
    results = resp.json().get("results", [])
    if not results:
        raise ValueError("Place not found")
    return results[0]["fsq_id"], results[0]  # return metadata if needed

def get_place_details(fsq_id: str):
    url = DETAILS_URL_TEMPLATE.format(fsq_id=fsq_id)
    resp = requests.get(url, headers=HEADERS)
    resp.raise_for_status()
    return resp.json()

def infer_crowdedness(place_details: dict):
    """
    Heuristic: 
      - If current popularity (0-100) exists, use that.
      - Else, look at popular times for current hour vs peak.
    Returns dict with decision and score explanation.
    """
    now = datetime.utcnow()  # or convert to local if you prefer
    hour = now.hour  # 0-23

    explanation = []
    score = 0.0
    max_score = 2.0  # for normalization

    # 1. Current popularity if available
    current_pop = place_details.get("hours", {}).get("popularity")  # field names vary; check actual payload
    if current_pop is not None:
        explanation.append(f"Current popularity is {current_pop}%.")
        score += (current_pop / 100)  # normalize to [0,1]
    else:
        explanation.append("No direct current popularity; falling back to historical popular times.")

    # 2. Popular times (example structure, adapt to real response)
    popular_times = place_details.get("populartimes")  # unofficial field; depends on availability
    if popular_times:
        # Find today’s entry
        weekday = now.weekday()  # Monday=0 ... Sunday=6
        today_data = next((d for d in popular_times if d["name"].lower() == now.strftime("%A").lower()), None)
        if today_data:
            hour_buckets = today_data.get("data", [])
            if hour < len(hour_buckets):
                hour_value = hour_buckets[hour]
                peak_value = max(hour_buckets)
                normalized = hour_value / peak_value if peak_value else 0
                explanation.append(f"At hour {hour}, historical normalized busyness is {normalized:.2f} of peak.")
                score += normalized  # another [0,1]
            else:
                explanation.append("Current hour outside popular_times data range.")
        else:
            explanation.append("No popular times entry for today.")
    else:
        explanation.append("No popular times data available.")

    # Final decision: thresholding
    normalized_score = score / max_score  # range ~0..1
    crowded = normalized_score >= 0.6  # tweak threshold based on calibration

    decision = "CROWDED" if crowded else "NOT CROWDED"
    explanation.append(f"Combined crowd score: {normalized_score:.2f} (threshold 0.6). Decision: {decision}.")

    return {
        "crowded": crowded,
        "score": normalized_score,
        "decision": decision,
        "explanation": " ".join(explanation),
    }

# Example usage:
def check_place(name: str, near: str = "Cairo"):
    fsq_id, meta = get_place_fsq_id(name, near=near)
    details = get_place_details(fsq_id)
    result = infer_crowdedness(details)
    print(f"Place: {name} ({fsq_id})")
    print("Decision:", result["decision"])
    print("Score:", result["score"])
    print("Why:", result["explanation"])
    return result

# This function would be called as:
print(check_place("Cairo Tower", near="Cairo"))
