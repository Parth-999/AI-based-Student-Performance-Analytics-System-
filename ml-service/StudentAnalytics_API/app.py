from flask import Flask, jsonify

from config import Config
from routes.health import health_bp
from routes.prediction import prediction_bp
from routes.analytics import analytics_bp
from errors.handlers import register_error_handlers
from routes.class_analytics import class_bp

app = Flask(__name__)
register_error_handlers(app)
app.config.from_object(Config)

app.register_blueprint(prediction_bp, url_prefix="/api/v1")
app.register_blueprint(health_bp, url_prefix="/api/v1")
app.register_blueprint(analytics_bp, url_prefix="/api/v1")
app.register_blueprint(class_bp, url_prefix="/api/v1")

@app.route("/")
def home():
    return jsonify({
        "project": app.config["PROJECT_NAME"],
        "version": app.config["API_VERSION"],
        "status": "Running"
    })

# Testing LoG
#@app.route("/error")
#def error():
#    return 10 / 0

# Default Routing for Checking API route working or not 
# @app.route("/health")
# def health():
#    return jsonify({
#        "status": "Healthy",
#        "version": "1.0.0"
#    })

if __name__ == "__main__":
    app.run(debug=app.config["DEBUG"])