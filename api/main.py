import os
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/select_city", methods=["POST"])
def select_city():
    data = request.json
    user_id = data.get("user_id")
    city = data.get("city")
    if not user_id or not city:
        return jsonify({"error": "user_id and city required"}), 400
    session = sessions.setdefault(user_id, UserSession(user_id))
    session.city = city
    return jsonify({"message": f"City set to {city} for user {user_id}."})

if __name__ == "__main__":
    app.run(debug=True)
