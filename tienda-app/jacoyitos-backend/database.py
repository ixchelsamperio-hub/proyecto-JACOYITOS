from pymongo import MongoClient
from flask_bcrypt import Bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

bcrypt = Bcrypt()

client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DB_NAME")]

usuarios_col  = db["usuarios"]
productos_col = db["productos"]
pedidos_col   = db["pedidos"]
