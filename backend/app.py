from flask import Flask, request
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from bson.objectid import ObjectId
from MongoDB_login import USERNAME, PASSWORD
import json
from functools import cmp_to_key

# ------ Flask Setup ------
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
bcrypt = Bcrypt(app)

# ------ MongoDB Setup ------
client = MongoClient(f"mongodb+srv://{USERNAME}:{PASSWORD}@mixx.eggih.mongodb.net/Mixx?retryWrites=true&w=majority")
db = client.Mixx
cocktail_db = db.Cocktails
ingr_db = db.Ingredients

# ------ Routing ------

# Signup
@app.route('/signup', methods=['POST'])
def signup():
    pass

# Login
@app.route('/login', methods=['POST'])
def login():
    pass

# Logout
@app.route('/logout', methods=['POST'])
def logout():
    pass

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
    return list(cocktail_db.find({}, {'name': 1, 'img': 1, 'subtitle': 1, '_id': 1}))

# Get Specific Cocktail's Info
@app.route('/cocktails/<cocktail_id>', methods=['Get'])
def get_cocktail_info(cocktail_id):
    return cocktail_db.find_one({"_id": cocktail_id})

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
    ]))

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

    return categorized_ingr

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