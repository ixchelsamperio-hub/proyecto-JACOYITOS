from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from database import bcrypt

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["*"])
bcrypt.init_app(app)

from routes.auth     import auth_bp
from routes.products import products_bp
from routes.orders   import orders_bp

app.register_blueprint(auth_bp,     url_prefix="/api/auth")
app.register_blueprint(products_bp, url_prefix="/api/products")
app.register_blueprint(orders_bp,   url_prefix="/api/orders")

@app.route("/api/health")
def health():
    return {"status": "ok", "message": "Jacoyitos backend corriendo 🌿"}

if __name__ == "__main__":
    print("🌿 Jacoyitos backend iniciando en http://localhost:5000")
    app.run(debug=True, port=5000)
