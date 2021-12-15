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
cors = CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = os.urandom(40)
bcrypt = Bcrypt(app)

# ------ MongoDB Setup ------
client = MongoClient(f"mongodb+srv://{USERNAME}:{PASSWORD}@mixx.eggih.mongodb.net/Mixx?retryWrites=true&w=majority")
db = client.Mixx
cocktail_db = db.Cocktails
ingr_db = db.Ingredients
user_db = db.Users
glassware_db = db.Glassware

# ------ Helper Functions ------

# Creates new user document for DB
def create_user(email, password_hash, first_name, last_name):
    return {
        'email': email,
        'password': password_hash,
        'first_name': first_name,
        'last_name': last_name,
        'ingredients': [],
        'favorite_cocktails': [],
        'shopping_list': [],
        'liked_cocktails': [],
        'disliked_cocktails': []
    }

# Checks if user is authorized for action (Cookies match)
def is_auth_user(user_id):
    return session.get('user_id', None) == user_id

# Queries for password hash and checks against received password
# Returns true if match
def get_check_password(user_id, password):
    hashed_password = user_db.find_one({"_id": ObjectId(user_id)}, {'password': 1})['password']
    return bcrypt.check_password_hash(hashed_password, password)

# Converts single cocktail response to JSON
def cocktail_to_json(cocktail):
    cocktail['_id'] = str(cocktail['_id'])
    cocktail['glass'] = str(cocktail['glass'])
    for ingredient in cocktail['ingredients']:
        ingredient['ingredient'] = str(ingredient['ingredient'])
    return cocktail

# Converts cocktails list response to JSON
def cocktails_to_json(cocktails):
    for cocktail in cocktails:
        cocktail = cocktail_to_json(cocktail)
    return cocktails

# ------ Routing ------

# Signup
@app.route('/signup', methods=['POST'])
def signup():
    signup_info = request.get_json()

    # Check that email isn't taken
    user = user_db.find_one({"email": signup_info['email']}, {'_id': 1})
    if user != None:
        # ERROR: Email already taken
        return {}, 460

    # Add user to database
    password_hash = bcrypt.generate_password_hash(signup_info['password'])
    user_id = user_db.insert_one(
        create_user(signup_info['email'], password_hash, signup_info['firstName'], signup_info['lastName'])
        ).inserted_id

    # Return userID
    session['user_id'] = str(user_id)
    return {'userID': str(user_id)}, 200

# Login
@app.route('/login', methods=['POST'])
def login():
    login_info = request.get_json()

    # Query for user with given email
    fields = ['_id', 'password', 'first_name', 'last_name']
    user = user_db.find_one({"email": login_info['email']}, {field: 1 for field in fields})
    if user == None:
        # ERROR: Email not found
        return {}, 461

    # Check if password matches
    authorized = bcrypt.check_password_hash(user['password'], login_info['password'])
    if authorized:
        session['user_id'] = str(user['_id'])
        return {'userID': str(user['_id']), 'firstName': user['first_name'], 'lastName': user['last_name']}, 200
    else:
        # ERROR: Incorrect Password
        return {}, 462

# Logout
@app.route('/logout', methods=['POST'])
def logout():
    user_id = request.get_json()['userID']

    # Check authorization
    if is_auth_user(user_id):
        # Delete Session
        session.pop('user_id', None)
        return {}, 200
    else:
        # ERROR: Unauthorized
        return {}, 401

# Delete Account
@app.route('/user/<user_id>/delete', methods=['POST'])
def delete_account(user_id):
    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    # Check password
    if not get_check_password(user_id, request.get_json()['password']):
        # ERROR: Incorrect Password
        return {}, 462

    # Delete User
    delete_result = user_db.delete_one({'_id': ObjectId(user_id)})

    # Check for success
    if delete_result.deleted_count > 0:
        session.pop('user_id', None)
        return {}, 200
    else:
        # Database Error
        return {}, 500

# Update Email
@app.route('/user/<user_id>/updateEmail', methods=['POST'])
def update_email(user_id):
    update_info = request.get_json()

    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    # Check password
    if not get_check_password(user_id, update_info['password']):
        # ERROR: Incorrect Password
        return {}, 462

    # Update
    update_resp = user_db.update_one({'_id': ObjectId(user_id)}, {'$set': {'email': update_info['newEmail']}})

    # Check for success
    if update_resp.modified_count > 0:
        return {}, 200
    else:
        # Database Error
        return {}, 500

# Update Password
@app.route('/user/<user_id>/updatePassword', methods=['POST'])
def update_password(user_id):
    update_info = request.get_json()

    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    # Check password
    if not get_check_password(user_id, update_info['oldPassword']):
        # ERROR: Incorrect Password
        return {}, 462

    password_hash = bcrypt.generate_password_hash(update_info['newPassword'])
    update_resp = user_db.update_one({'_id': ObjectId(user_id)}, {'$set': {'password': password_hash}})

    # Check for success
    if update_resp.modified_count > 0:
        return {}, 200
    else:
        # Database Error
        return {}, 500

# Get Name
@app.route('/user/<user_id>/name', methods=['GET'])
def get_name(user_id):
    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    resp = user_db.find_one({'_id': ObjectId(user_id)}, {'first_name': 1, 'last_name': 1})

    if resp != None:
        return {'firstName': resp['first_name'], 'lastName': resp['last_name']}, 200
    return {}, 500

# Update Name
@app.route('/user/<user_id>/updateName', methods=['POST'])
def update_name(user_id):
    update_info = request.get_json()

    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    update_resp = user_db.update_one({'_id': ObjectId(user_id)}, 
        {'$set': {'first_name': update_info['firstName'], 'last_name': update_info['lastName']}})
    
    # Check for success
    if update_resp.modified_count > 0:
        return {}, 200
    else:
        # Database Error
        return {}, 500

# Get Current User's Ingredients
@app.route('/user/<user_id>/ingredients', methods=['Get'])
def get_user_ingredients(user_id):
    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    ingredientIDs = user_db.find_one({'_id': ObjectId(user_id)}, {'ingredients': 1}).get('ingredients', [])
    return {'ingredientIDs': [str(ingredientID) for ingredientID in ingredientIDs]}, 200

# Update User Ingredients
@app.route('/user/<user_id>/ingredients/update', methods=['POST'])
def update_user_ingredients(user_id):
    update_info = request.get_json()

    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    new_ingredients = [ObjectId(ingr_id) for ingr_id in update_info['newIngredients']]
    removed_ingredients = [ObjectId(ingr_id) for ingr_id in update_info['removedIngredients']]

    modified_cnt = 0
    modified_cnt += user_db.update_one({'_id': ObjectId(user_id)}, {
        '$addToSet': {'ingredients': {'$each': new_ingredients}},
    }).modified_count
    modified_cnt += user_db.update_one({'_id': ObjectId(user_id)}, {
        '$pull': {'ingredients': {'$in': removed_ingredients}}
    }).modified_count

     # Check for success
    if modified_cnt > 0:
        ingredientIDs = user_db.find_one({'_id': ObjectId(user_id)}, {'ingredients': 1}).get('ingredients', [])
        return {'ingredientIDs': [str(ingredientID) for ingredientID in ingredientIDs]}, 200
    else:
        # Database Error
        return {}, 500

# Get Possible Cocktails
@app.route('/user/<user_id>/cocktails', methods=['Get'])
def get_possible_cocktails(user_id):
    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    # Get Ingredients
    ingredients = user_db.find_one({'_id': ObjectId(user_id)}, {'ingredients': 1}).get('ingredients', [])

    if len(ingredients) == 0:
        return {'cocktails': []}, 200

    # Get Cocktails
    cocktails = list(cocktail_db.aggregate([
        {
            "$match": {
                "$expr": {
                    "$setIsSubset": [{
                        "$map": {
                            "input": "$ingredients",
                            "as": "ingredient",
                            "in": "$$ingredient.ingredient"
                        }
                    }, ingredients]
                }
            }
        }
    ]))
    return {'cocktails': cocktails_to_json(cocktails)}, 200

# Get All Cocktails
@app.route('/cocktails', methods=['Get'])
def get_all_cocktails():
    return {'cocktails': cocktails_to_json(list(cocktail_db.find({})))}, 200

# Get Specific Cocktail's Info
@app.route('/cocktails/<cocktail_id>', methods=['Get'])
def get_cocktail_info(cocktail_id):
    cocktail_info = cocktail_db.find_one({"_id": ObjectId(cocktail_id)})
    return {'cocktail': cocktail_to_json(cocktail_info)}, 200

# Get Cocktails Containing Ingredient
@app.route('/cocktails/containing/<ingredient_id>', methods=['Get'])
def get_cocktail_containing(ingredient_id):
    ingr_id = ObjectId(ingredient_id)
    return {'cocktails': list(cocktail_db.aggregate([
        {
            "$match": {
                "$expr": {
                    "$in": [
                        ingr_id,
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
    ]))}, 200

# Get All Ingredients
@app.route('/ingredients', methods=['GET'])
def get_all_ingredients():
    ingr_query_resp = list(ingr_db.find({}))

    # Convert ObjectID -> String for JSON
    for ingredient in ingr_query_resp:
        ingredient['_id'] = str(ingredient['_id'])

    return {'ingredients': ingr_query_resp}, 200

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
            ingredients = sorted(subcategory['ingredients'], key=cmp_to_key(sort_ingr))
            # Converts id to string for JSON
            for ingr in ingredients:
                ingr['id'] = str(ingr['id'])
            categorized_ingr[category][subcategory['subcategory']] = ingredients

    return {'ingredients': categorized_ingr}, 200

# Get Ingredients' Info (from IDs)
@app.route('/ingredients/some', methods=['POST'])
def get_ingredients_info():
    ingredient_IDs = [ObjectId(ingredient_ID) for ingredient_ID in request.get_json()['ingredientIDs']]
    ingredients_resp = list(ingr_db.find({'_id': {'$in': ingredient_IDs}}))

    # Convert ObjectID --> String for JSON
    for ingredient in ingredients_resp:
        ingredient['_id'] = str(ingredient['_id'])
    return {'ingredients': ingredients_resp}, 200

# Like Cocktail
@app.route('/user/<user_id>/cocktails/like', methods=['POST'])
def like_cocktail(user_id):
    liked_cocktail = ObjectId(request.get_json()['cocktailID'])

    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    update_resp = user_db.update_one({'_id': ObjectId(user_id)}, {'$addToSet': {'liked_cocktails': liked_cocktail}})

     # Check for success
    if update_resp.modified_count > 0:
        return {}, 200
    else:
        # Database Error
        return {}, 500

# Removed Liked Cocktail
@app.route('/user/<user_id>/cocktails/remove_like', methods=['POST'])
def remove_liked_cocktail(user_id):
    unliked_cocktail = ObjectId(request.get_json()['cocktailID'])

    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    update_resp = user_db.update_one({'_id': ObjectId(user_id)}, {'$pull': {'liked_cocktails': unliked_cocktail}})
     # Check for success
    if update_resp.modified_count > 0:
        return {}, 200
    else:
        # Database Error
        return {}, 500

# Dislike Cocktail
@app.route('/user/<user_id>/cocktails/dislike', methods=['POST'])
def dislike_cocktail(user_id):
    disliked_cocktail = ObjectId(request.get_json()['cocktailID'])

    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    update_resp = user_db.update_one({'_id': ObjectId(user_id)}, {'$addToSet': {'disliked_cocktails': disliked_cocktail}})

     # Check for success
    if update_resp.modified_count > 0:
        return {}, 200
    else:
        # Database Error
        return {}, 500

# Removed Disliked Cocktail
@app.route('/user/<user_id>/cocktails/remove_dislike', methods=['POST'])
def remove_disliked_cocktail(user_id):
    undisliked_cocktail = ObjectId(request.get_json()['cocktailID'])

    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    update_resp = user_db.update_one({'_id': ObjectId(user_id)}, {'$pull': {'disliked_cocktails': undisliked_cocktail}})
     # Check for success
    if update_resp.modified_count > 0:
        return {}, 200
    else:
        # Database Error
        return {}, 500

# Get Liked Cocktails
@app.route('/user/<user_id>/cocktails/likes', methods=['Get'])
def get_liked_cocktails(user_id):
    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    liked_cocktails = user_db.find_one({'_id': ObjectId(user_id)}, {'liked_cocktails': 1})['liked_cocktails']

    return {'cocktails': [str(liked_cocktail) for liked_cocktail in liked_cocktails]}, 200

# Get Disliked Cocktails
@app.route('/user/<user_id>/cocktails/dislikes', methods=['Get'])
def get_disliked_cocktails(user_id):
    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    disliked_cocktails = user_db.find_one({'_id': ObjectId(user_id)}, {'disliked_cocktails': 1})['disliked_cocktails']

    return {'cocktails': [str(disliked_cocktail) for disliked_cocktail in disliked_cocktails]}, 200

# Get liked / disliked status of one cocktail
@app.route('/user/<user_id>/cocktails/like_status', methods=['POST'])
def get_like_dislike_status(user_id):
    cocktail_id = request.get_json()['cocktailID']

    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    like_dislike_lists = user_db.find_one({'_id': ObjectId(user_id)}, {'disliked_cocktails': 1, 'liked_cocktails': 1})
    liked_cocktails = [str(liked_cocktail) for liked_cocktail in like_dislike_lists['liked_cocktails']]
    disliked_cocktails = [str(disliked_cocktail) for disliked_cocktail in like_dislike_lists['disliked_cocktails']]

    liked_status = "None"
    if cocktail_id in liked_cocktails:
        liked_status = 'Liked'
    elif cocktail_id in disliked_cocktails:
        liked_status = 'Disliked'

    return {'likeStatus': liked_status}, 200

# Favorite Cocktail
@app.route('/user/<user_id>/cocktails/favorite', methods=['POST'])
def favorite_cocktail(user_id):
    favorited_cocktail = ObjectId(request.get_json()['cocktailID'])

    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    update_resp = user_db.update_one({'_id': ObjectId(user_id)}, {'$addToSet': {'favorite_cocktails': favorited_cocktail}})

     # Check for success
    if update_resp.modified_count > 0:
        return {}, 200
    else:
        # Database Error
        return {}, 500

# Unfavorite Cocktail
@app.route('/user/<user_id>/cocktails/unfavorite', methods=['POST'])
def unfavorite_cocktail(user_id):
    unfavorited_cocktail = ObjectId(request.get_json()['cocktailID'])

    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    update_resp = user_db.update_one({'_id': ObjectId(user_id)}, {'$pull': {'favorite_cocktails': unfavorited_cocktail}})
     # Check for success
    if update_resp.modified_count > 0:
        return {}, 200
    else:
        # Database Error
        return {}, 500

# Get Favorited Cocktails
@app.route('/user/<user_id>/cocktails/favorites', methods=['Get'])
def get_favorited_cocktails(user_id):
    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    favorite_cocktails = user_db.find_one({'_id': ObjectId(user_id)}, {'favorite_cocktails': 1})['favorite_cocktails']

    return {'cocktails': [str(cocktail) for cocktail in favorite_cocktails] or []}, 200

# Get All Glassware
@app.route('/glassware', methods=['Get'])
def get_all_glassware():
    glassware_list = list(glassware_db.find({}))

    # Convert ObjectID -> String for JSON
    for glassware in glassware_list:
        glassware['_id'] = str(glassware['_id'])

    return {'glassware': glassware_list}, 200

# Get Glassware Info
@app.route('/glassware/<glassware_id>', methods=['Get'])
def get_glassware_info(glassware_id):
    glassware = glassware_db.find_one({'_id': ObjectId(glassware_id)})

    # Convert ObjectID -> String for JSON
    glassware['_id'] = str(glassware['_id'])

    return {'glassware': glassware}, 200

# Recommend ingredients
@app.route('/user/<user_id>/ingredients/recommendations', methods=['GET'])
def get_recommended_ingredients(user_id):
    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401
    
    ingredient_recommendations = {}
    all_cocktails = list(cocktail_db.find({}))
    ingredientIDs = user_db.find_one({'_id': ObjectId(user_id)}).get('ingredients', [])

    for cocktail in all_cocktails:
        ingredients = cocktail.get('ingredients', [])
        cocktail_list = []
        for ingredient in ingredients:
            ingredient_ = ingredient['ingredient']
            cocktail_list.append(ingredient_)
        dif = set(cocktail_list).difference(set(ingredientIDs))
        if (len(dif) == 1):
            if str(list(dif)[0]) in ingredient_recommendations:
                ingredient_recommendations[str(list(dif)[0])].append({'id': str(cocktail['_id']), 'name': cocktail['name']})
            else:
                ingredient_recommendations[str(list(dif)[0])] = [{'id': str(cocktail['_id']), 'name': cocktail['name']}]
    return {'recommendations': ingredient_recommendations}, 200

# Recommend cocktails based on liked recipes
@app.route('/user/<user_id>/cocktails/recommendations', methods=['GET'])
def get_recommended_cocktails_by_users(user_id):
    # Check authorization
    if not is_auth_user(user_id):
        # ERROR: Unauthorized
        return {}, 401

    user_resp = user_db.find_one({'_id': ObjectId(user_id)})
    liked = user_resp.get('liked_cocktails', [])
    disliked = user_resp.get('disliked_cocktails', [])
    all_users = list(user_db.find({}))

    common_likes = {}
    for user in all_users:
        user_liked = user.get('liked_cocktails', [])
        if user.get('_id') != user_id:
            cocktail_interseciton = set(user_liked).intersection(set(liked)) 
            common_likes[user.get('_id')] = len(cocktail_interseciton)

    if(len(common_likes.keys()) == 0):
        return {'recommendations': get_recommended_cocktails(user_id)}, 200

    most_common = max(common_likes, key=common_likes.get)
    most_common_user_liked = user_db.find_one({'_id': ObjectId(most_common)}).get('liked_cocktails', [])
    cocktail_difference = set(most_common_user_liked).difference(set(liked))

    if len(cocktail_difference) != 0:
        results = cocktail_difference.difference(disliked)
        recommendations = []
        for cocktail in results:
            cocktail_info = cocktail_db.find_one({'_id': cocktail})
            recommendations.append({'id': str(cocktail_info['_id']), 'name': cocktail_info['name']})
    else:
        recommendations = get_recommended_cocktails(user_id)

    return {'recommendations': recommendations}, 200

def get_recommended_cocktails(user_id):
    user_resp = user_db.find_one({'_id': ObjectId(user_id)})
    liked_cocktails = user_resp.get('liked_cocktails', [])
    favorite_cocktails = user_resp.get('favorite_cocktails', [])
    all_cocktails = list(cocktail_db.find({}))
    favorite_ingredients = {}
    cocktail_recommendations = []
    for cocktail in liked_cocktails:
        ingredients = cocktail_db.find_one({'_id': cocktail}).get('ingredients', []) # Get ingredients for each cocktail
        for ingredient in ingredients:
            ingrdient_ = ingredient['ingredient']
            if ingrdient_ in favorite_ingredients:
                favorite_ingredients[ingrdient_] += 1
            else:
                favorite_ingredients[ingrdient_] = 1
    for cocktail in all_cocktails:
        ingredients = cocktail.get('ingredients', [])
        cocktail_list = []
        for ingredient in ingredients:
            ingredient_ = ingredient['ingredient']
            cocktail_list.append(ingredient_)
        ingredient_intersection = set(cocktail_list).intersection(set(favorite_ingredients))  # Get cocktails that contain combos of these ingredients
        if (len(ingredient_intersection) > 2 and cocktail.get('_id') not in favorite_cocktails \
            and cocktail.get('_id') not in liked_cocktails):
            cocktail_recommendations.append({'id': str(cocktail['_id']), 'name': cocktail['name']})
    return cocktail_recommendations

if __name__ == "__main__":
    app.run(debug=True)
