def generate_student_insights(data):

    attendance = data["attendance"]
    subjects = data["subjects"]

    marks = [subject["marks"] for subject in subjects]

    average = round(sum(marks) / len(marks), 2)

    highest = max(subjects, key=lambda x: x["marks"])
    lowest = min(subjects, key=lambda x: x["marks"])

    strong_subjects = [
        subject["name"]
        for subject in subjects
        if subject["marks"] >= 75
    ]

    weak_subjects = [
        subject["name"]
        for subject in subjects
        if subject["marks"] < 60
    ]

    if attendance >= 85:
        attendance_status = "Excellent"
    elif attendance >= 75:
        attendance_status = "Good"
    else:
        attendance_status = "Poor"

    recommendations = []

    if attendance < 75:
        recommendations.append("Improve attendance.")

    if weak_subjects:
        recommendations.append(
            f"Focus on {', '.join(weak_subjects)}."
        )

    return {
    "success": True,
    "message": "Student insights generated successfully.",
    "data": {
        "averageMarks": average,
        "highestSubject": highest,
        "lowestSubject": lowest,
        "attendanceStatus": attendance_status,
        "strongSubjects": strong_subjects,
        "weakSubjects": weak_subjects,
        "recommendations": recommendations
    }
}