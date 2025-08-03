from flask import Flask, request, jsonify
from crewai_tools import SerperDevTool
from crew.recommendation_agent import RecommendationAgent
from data_manager.DataManager import DataManager

app = Flask(__name__)

search_tool = SerperDevTool()
recommendation_agent = RecommendationAgent(search_tool)
data_manager = DataManager("database")

@app.route("/generate_places", methods=["POST"])
def generate_places():
    data = request.json
    city = data.get("city")
    interests = data.get("interests")
    return jsonify(recommendation_agent.generate_places_json(city, interests))


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if data_manager.verify_user_credentials(username, password):
        return jsonify({"status": "success"}), 200
    else:
        return jsonify({"status": "fail"}), 401


@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    try:
        data_manager.add_new_user(username, password)
    except:
        return jsonify({"status": "success"}), 401
    return jsonify({"status": "success"}), 200


if __name__ == "__main__":
    app.run(debug=True)
