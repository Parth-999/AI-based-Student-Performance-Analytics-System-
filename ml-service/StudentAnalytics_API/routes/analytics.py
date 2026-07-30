from flask import Blueprint, request, jsonify

from validators.analytics_validator import validate_student_insights
from services.analytics_service import generate_student_insights

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/student-insights", methods=["POST"])
def student_insights():

    data = request.get_json()

    valid, error = validate_student_insights(data)

    if not valid:
        return jsonify(error), 400

    result = generate_student_insights(data)

    return jsonify(result), 200