from flask import Flask, request, jsonify
from crewai_tools import SerperDevTool, ScrapeWebsiteTool
from crew.recommendation_agent import RecommendationAgent
from data_manager.data_manager import DataManager

app = Flask(__name__)

search_tool = SerperDevTool()
scrapping_tool = ScrapeWebsiteTool()
recommendation_agent = RecommendationAgent(search_tool, scrapping_tool)
data_manager = DataManager("database")


@app.route("/generate_places", methods=["POST"])
def generate_places():
    """Generate recommended places based on city and user interests.

    Expects JSON body with:
        city (str): Name of the city.
        interests (list[str] or str): User interests to tailor recommendations.

    Returns:
        flask.Response: JSON list of places.
    """
    data = request.json or {}
    city = data.get("city")
    interests = data.get("interests")

    if not city or not interests:
        return jsonify({"error": "Both 'city' and 'interests' are required."}), 400

    places = recommendation_agent.generate_places_json(city, interests)
    return jsonify(places), 200


@app.route("/login", methods=["POST"])
def login():
    """Authenticate user with username and password.

    Expects JSON body with:
        username (str)
        password (str)

    Returns:
        flask.Response: Success or failure status.
    """
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return (
            jsonify({"status": "fail", "reason": "Username and password required."}),
            400,
        )

    if data_manager.verify_user_credentials(username, password):
        return jsonify({"status": "success"}), 200
    else:
        return jsonify({"status": "fail", "reason": "Invalid credentials."}), 401


@app.route("/register", methods=["POST"])
def register():
    """Register a new user with username and password.

    Expects JSON body with:
        username (str)
        password (str)

    Returns:
        flask.Response: Success or failure status, with appropriate code.
    """
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return (
            jsonify({"status": "fail", "reason": "Username and password required."}),
            400,
        )

    try:
        data_manager.add_new_user(username, password)
    except Exception as e:
        # Could be uniqueness violation or other DB error
        return jsonify({"status": "fail", "reason": str(e)}), 409

    return jsonify({"status": "success"}), 201


@app.route("/get_leaderboard", methods=["GET"])
def get_leaderboard():
    """Retrieve leaderboard of users sorted by score descending.

    Returns:
        flask.Response: JSON list of username/score pairs.
    """
    rows = data_manager.get_leaderboard()
    leaderboard = [{"username": row["username"], "score": row["score"]} for row in rows]
    return jsonify(leaderboard), 200


if __name__ == "__main__":
    app.run(debug=True)
