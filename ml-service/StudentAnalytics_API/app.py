from flask import Flask, jsonify
from routes.health import health_bp

app = Flask(__name__)

app.register_blueprint(health_bp, url_prefix="/api/v1")

@app.route("/")
def home():
    return jsonify({
        "message": "AI-Based Student Performance Analytics API",
        "status": "Running"
    })

# Default Routing for Checking API route working or not 
# @app.route("/health")
# def health():
#    return jsonify({
#        "status": "Healthy",
#        "version": "1.0.0"
#    })

if __name__ == "__main__":
    app.run(debug=True)