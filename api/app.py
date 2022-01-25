from flask import Flask
from flask_restx import Resource

from api.resources import api_blueprint


class IndexResource(Resource):
    def get(self):
        return "Hi"


class Application:
    def __init__(self):
        self.app = Flask(__name__, static_folder="public", static_url_path="/")
        self.app.register_blueprint(api_blueprint, url_prefix="/api")
        self.app.add_url_rule("/", view_func=self.serve_ui)

    def serve_ui(self):
        return self.app.send_static_file("index.html")

    def run_debug(self):
        self.app.run(debug=True)


app = Application()
flask_app = app.app

if __name__ == "__main__":
    app.run_debug()
