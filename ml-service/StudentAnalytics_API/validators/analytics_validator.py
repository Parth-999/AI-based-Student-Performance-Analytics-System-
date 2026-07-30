def validate_student_insights(data):

    if not data:
        return False, {
            "success": False,
            "message": "Request body cannot be empty."
        }

    if "attendance" not in data:
        return False, {
            "success": False,
            "message": "'attendance' is required."
        }

    attendance = data["attendance"]

    if not isinstance(attendance, (int, float)):
        return False, {
            "success": False,
            "message": "Attendance must be a number."
        }

    if attendance < 0 or attendance > 100:
        return False, {
            "success": False,
            "message": "Attendance must be between 0 and 100."
        }

    if "subjects" not in data:
        return False, {
            "success": False,
            "message": "'subjects' is required."
        }

    subjects = data["subjects"]

    if not isinstance(subjects, list):
        return False, {
            "success": False,
            "message": "'subjects' must be a list."
        }

    if len(subjects) == 0:
        return False, {
            "success": False,
            "message": "At least one subject is required."
        }

    for subject in subjects:

        if "name" not in subject:
            return False, {
                "success": False,
                "message": "Each subject must contain 'name'."
            }

        if "marks" not in subject:
            return False, {
                "success": False,
                "message": f"Marks missing for {subject['name']}."
            }

        marks = subject["marks"]

        if not isinstance(marks, (int, float)):
            return False, {
                "success": False,
                "message": f"Marks for {subject['name']} must be numeric."
            }

        if marks < 0 or marks > 100:
            return False, {
                "success": False,
                "message": f"Marks for {subject['name']} must be between 0 and 100."
            }

    return True, None