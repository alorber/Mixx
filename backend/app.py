from flask import Flask, redirect, url_for
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

# ------ MongoDB Setup ------
client = MongoClient(f"mongodb+srv://{USERNAME}:{PASSWORD}@mixx.eggih.mongodb.net/Mixx?retryWrites=true&w=majority")
db = client.Mixx
cocktail_db = db.Cocktails
ingr_db = db.Ingredients

# ------ Routing ------

# Signup
@app.route('/signup')
def signup():
    pass

# Login
@app.route('/login')
def login():
    pass

# Logout
@app.route('/logout')
def logout():
    pass

# Delete Account
@app.route('/user/<user_id>/delete')
def delete_account():
    pass

# Update Email
@app.route('/user/<user_id>/updateEmail')
def update_email():
    pass

# Update Password
@app.route('/user/<user_id>/updatePassword')
def update_password():
    pass

# Get Current User's Ingredients
@app.route('/user/<user_id>/ingredients')
def get_user_ingredients():
    pass

# Add Ingredients
@app.route('/user/<user_id>/ingredients/add')
def add_user_ingredients():
    pass

# Remove Ingredients
@app.route('/user/<user_id>/ingredients/remove')
def remove_user_ingredients():
    pass

# Get Possible Cocktails
@app.route('user/<user_id>/cocktails')
def get_possible_cocktails():
    pass

# Get All Cocktails (Display Info)
@app.route('/cocktails')
def get_all_cocktails():
    return list(cocktail_db.find({}, {'name': 1, 'img': 1, 'subtitle': 1, '_id': 1}))

# Get Specific Cocktail's Info
@app.route('/cocktails/<cocktail_id>')
def get_cocktail_info(cocktail_id):
    return cocktail_db.find_one({"_id": cocktail_id})

# Get Cocktails Containing Ingredient
@app.route('/cocktails/containing/<ingredient_id>')
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
@app.route('/ingredients/categorized')
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
@app.route('/user/<user_id>/cocktails/like')
def like_cocktail():
    pass

# Dislike Cocktail
@app.route('/user/<user_id>/cocktails/dislike')
def dislike_cocktail():
    pass

# Favorite Cocktail
@app.route('/user/<user_id>/cocktails/favorite')
def favorite_cocktail():
    pass

# Unfavorite Cocktail
@app.route('/user/<user_id>/cocktails/unfavorite')
def unfavorite_cocktail():
    pass

# Get favorited Cocktails
@app.route('/user/<user_id>/cocktails/favorites')
def get_favorited_cocktails():
    pass

if __name__ == "__main__":
    app.run(debug=True)