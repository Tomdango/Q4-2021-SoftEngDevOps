from flask import Flask

from api.resources import api


class Application:
    def __init__(self):
        self.app = Flask(__name__)
        api.init_app(self.app)

    def run_debug(self):
        self.app.run(debug=True)

if __name__ == "__main__":
    app = Application()
    app.run_debug()
