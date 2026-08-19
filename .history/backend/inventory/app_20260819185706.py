from flask import Flask
from extensions import db, migrate
from inventory import inventory_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(inventory_bp)
    

    return app