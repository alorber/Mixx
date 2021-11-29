from flask import Flask, request, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from bson.objectid import ObjectId
from MongoDB_login import USERNAME, PASSWORD
import json
from functools import cmp_to_key
import os

# ------ Flask Setup ------
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = os.urandom(40)
bcrypt = Bcrypt(app)

# ------ MongoDB Setup ------
client = MongoClient(f"mongodb+srv://{USERNAME}:{PASSWORD}@mixx.eggih.mongodb.net/Mixx?retryWrites=true&w=majority")
db = client.Mixx
cocktail_db = db.Cocktails
ingr_db = db.Ingredients
user_db = db.Users

def create_user(email, password_hash, first_name, last_name):
    return {
        'email': email,
        'password': password_hash,
        'first_name': first_name,
        'last_name': last_name
    }

# ------ Routing ------

# Signup
@app.route('/signup', methods=['POST'])
def signup():
    signup_info = request.get_json()

    # Check that email isn't taken
    user = cocktail_db.find_one({"email": signup_info['email']})
    if user != None:
        # ERROR: Email already taken
        return {}, 460

    # Add user to database
    password_hash = bcrypt.generate_password_hash(signup_info['password'])
    user_id = user_db.insert_one(
        create_user(signup_info['email'], password_hash, signup_info['firstName'], signup_info['lastName'])
        ).inserted_id

    # Return userID
    session['user_id'] = user_id
    return {'userID': user_id}, 200

# Login
@app.route('/login', methods=['POST'])
def login():
    login_info = request.get_json()

    # Query for user with given email
    user = cocktail_db.find_one({"email": login_info['email']})
    if user == None:
        # ERROR: Email not found
        return {}, 461

    # Check if password matches
    authorized = bcrypt.check_password_hash(user['password'], login_info['password'])

    if authorized:
        session['user_id'] = user['_id']
        return {'userID': user['_id'], 'firstName': user['first_name'], 'lastName': user['last_name']}, 200
    else:
        # ERROR: Incorrect Password
        return {}, 462

# Logout
@app.route('/logout', methods=['POST'])
def logout():
    user_id = request.get_json()['userID']

    # Check cookie
    if session.get('user_id', None) == user_id:
        # Delete Session
        session.pop('user_id', None)
        return {}, 200
    else:
        # ERROR: Unauthorized
        return {}, 401

# Delete Account
@app.route('/user/<user_id>/delete', methods=['POST'])
def delete_account():
    pass

# Update Email
@app.route('/user/<user_id>/updateEmail', methods=['POST'])
def update_email():
    pass

# Update Password
@app.route('/user/<user_id>/updatePassword', methods=['POST'])
def update_password():
    pass

# Get Current User's Ingredients
@app.route('/user/<user_id>/ingredients', methods=['Get'])
def get_user_ingredients():
    pass

# Add Ingredients
@app.route('/user/<user_id>/ingredients/add', methods=['POST'])
def add_user_ingredients():
    pass

# Remove Ingredients
@app.route('/user/<user_id>/ingredients/remove', methods=['POST'])
def remove_user_ingredients():
    pass

# Get Possible Cocktails
@app.route('/user/<user_id>/cocktails', methods=['Get'])
def get_possible_cocktails():
    pass

# Get All Cocktails (Display Info)
@app.route('/cocktails', methods=['Get'])
def get_all_cocktails():
    return list(cocktail_db.find({}, {'name': 1, 'img': 1, 'subtitle': 1, '_id': 1})), 200

# Get Specific Cocktail's Info
@app.route('/cocktails/<cocktail_id>', methods=['Get'])
def get_cocktail_info(cocktail_id):
    return cocktail_db.find_one({"_id": cocktail_id}), 200

# Get Cocktails Containing Ingredient
@app.route('/cocktails/containing/<ingredient_id>', methods=['Get'])
def get_cocktail_containing(ingredient_id):
    return list(cocktail_db.aggregate([
        {
            "$match": {
                "$expr": {
                    "$in": [
                        ingredient_id,
                        {"$map": {
                                "input": "$ingredients",
                                "as": "ingredient",
                                "in": "$$ingredient.ingredient"
                                }
                        }
                    ]
                }
            }
        }
    ])), 200

# Get Categorized Ingredients
@app.route('/ingredients/categorized', methods=['Get'])
def get_categorized_ingredients():
    ingr_query_resp = list(ingr_db.aggregate([
        {
            '$group': {
                '_id': {
                    'category': '$category', 
                    'subcategory': '$subcategory'
                }, 
                'ingredients': {
                    '$addToSet': {
                        'name': '$name', 
                        'id': '$_id'
                    }
                }
            }
        }, {
            '$group': {
                '_id': '$_id.category', 
                'subcategories': {
                    '$addToSet': {
                        'ingredients': '$ingredients', 
                        'subcategory': '$_id.subcategory'
                    }
                }
            }
        }
    ]))

    def sort_subcategories(sc1, sc2):
        return -1 if sc1['subcategory'] < sc2['subcategory'] else 1
    def sort_ingr(i1, i2):
        return -1 if i1['name'] < i2['name'] else 1
    
    # Order categories in this order. Subcategories & ingredients are ordered alphabetically
    CATEGORY_ORDER = ['Spirits', 'Liqueurs', 'Wines and Champagnes', 'Beers and Ciders', 'Mixers', 'Other']
    categorized_ingr = {}
    for category in CATEGORY_ORDER:
        categorized_ingr[category] = {}
        subcategories = sorted([categories['subcategories'] for categories in ingr_query_resp if categories['_id'] == category][0], key=cmp_to_key(sort_subcategories))
        for subcategory in subcategories:
            categorized_ingr[category][subcategory['subcategory']] = sorted(subcategory['ingredients'], key=cmp_to_key(sort_ingr))

    return categorized_ingr, 200

# Like Cocktail
@app.route('/user/<user_id>/cocktails/like', methods=['POST'])
def like_cocktail():
    pass

# Dislike Cocktail
@app.route('/user/<user_id>/cocktails/dislike', methods=['POST'])
def dislike_cocktail():
    pass

# Get Liked Cocktails
@app.route('/user/<user_id>/cocktails/likes', methods=['Get'])
def get_liked_cocktails():
    pass

# Get Disliked Cocktails
@app.route('/user/<user_id>/cocktails/dislikes', methods=['Get'])
def get_disliked_cocktails():
    pass

# Favorite Cocktail
@app.route('/user/<user_id>/cocktails/favorite', methods=['POST'])
def favorite_cocktail():
    pass

# Unfavorite Cocktail
@app.route('/user/<user_id>/cocktails/unfavorite', methods=['POST'])
def unfavorite_cocktail():
    pass

# Get Favorited Cocktails
@app.route('/user/<user_id>/cocktails/favorites', methods=['Get'])
def get_favorited_cocktails():
    pass

if __name__ == "__main__":
    app.run(debug=True)