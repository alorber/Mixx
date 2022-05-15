# Mixx
###### A home bartender's best friend

## Table of Contents
1. [Introduction](#introduction)

2. [Features](#features)

3. [Schema Overview](#schema-overview-mongodb)

## Introduction

Mixx is a web-app that allows users to discover which cocktails can be created from their bar stock.

Users can create an account to track their current inventory, receiving cocktail suggestions based on what they have on hand and ingredient suggestions for their next purchase. Users can save cocktails for later or rate cocktails to receive recommendations. Even without creating an account, users can browse the entire database of cocktails and ingredients, viewing recipes and step-by-step instructions.

The project was built using React, Flask, & MongoDB.

## Features

The site offers various features including: account creation & modification, inventory storage, viewing of available cocktails, cocktail favoriting (saving), cocktail rating, cocktail recommendations, ingredient purchase recommendations, cocktail & ingredient database exploration, cocktail instructions & recipes, and various filters / search options.

The site is split into two sections: one which is only accessible with an account and one that can be viewed by anyone.

Additionally, the site is completely responsive to different screen sizes.

### Home Page

The Home Page displays the various features this site offers. Clicking “See what you can make” will bring you to the <i>MyCocktails</i> page, which displays the cocktails that can be made from your ingredients.

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151058033-f5b5d959-bcbc-49f2-bb93-a85dadd62398.png" alt="Homepage 1/2" width=600 />
  <img src="https://user-images.githubusercontent.com/13024480/151058078-717a675c-f556-4d4a-87d5-2aec80e444f4.png" alt="Homepage 2/2" width=600 />
  <p align="center"><i>Homepage</i></p>
</p>

### Navbar

The Navbar features a logo, which links to the homepage, as well as two dropdown menus: *My Bar* & *Explore*. *My Bar* includes pages which require an account, while the pages contained within *Explore* can be used by all. *Sign In* links to a login/signup page, and once logged in, it is replaced by a settings icon.

<p align='center' width='100%'>
  <img src='https://user-images.githubusercontent.com/13024480/151060339-6aab6f23-4214-4445-aa19-1a1e1563237b.png' width=600 />
  <p align="center"><i>Navbar - 'MyBar' Dropdown</i></p>
</p>
  
<p align='center' width='100%'>
  <img src='https://user-images.githubusercontent.com/13024480/151060297-1eb07fff-239d-450d-8168-553512bd783a.png' width=600 />
  <p align="center"><i>Navbar - 'Explore' Dropdown</i></p>
</p>

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151060420-df5d0a80-7d22-49a5-81ad-b921195b20a2.png" width=600 />
  <p align="center"><i>Settings Icon (Once Signed In)</i></p>
</p>

### Login / Signup Page

The Login / Signup Page allows users to log into their accounts or create a new account. It also displays reasons to create an account, as well as feedback on different errors.

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151065246-f0705319-287c-486d-aefa-aa9a3faa5c01.png" width=600 />
  <p align="center"><i>Login / Signup Page (Login Showing)</i></p>
</p>

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151065280-0ce56a27-1335-4c43-9253-472c850217bd.png" width=600 />
  <p align="center"><i>Login / Signup Page (Signup Showing)</i></p>
</p>

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151065326-b0996ec7-8bed-4f28-b56e-a7c9a2f3127f.png" width=600 />
  <p align="center"><i>Login Error</i></p>
</p>

### My Ingredients Page

On the *MyIngredients* page, ingredients can be added to or removed from your account. Ingredients can be searched for by name. Hovering over ingredients will show a + or - depending on whether adding or removing. The website is also mobile friendly; when the screen gets too small, there will be tabs to switch between ingredient lists.

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151066067-9c075f1c-868a-4407-9a22-727dff6393ac.png" width=600 />
  <p align="center"><i>My Ingredients Page - Removing an Ingredient</i></p>
</p>

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151066027-5f304376-2bdb-4d47-9b66-369d13ad2d32.png" width=600 />
  <p align="center"><i>My Ingredients Page - Searching and Adding an Ingredient</i></p>
</p>

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151066130-a1406a8b-e2c5-47e4-a8cf-2c06fa482699.png" width=600 />
  <p align="center"><i>My Ingredients Page - Mobile Responsive</i></p>
</p>

### My Cocktails Page

The *MyCocktails* page will display all the cocktails that can be made from your ingredients. Cocktails will be sorted in alphabetical order, with favorited cocktails on top. Cocktails can be favorited for quick access by clicking the heart icon. Cocktail can be searched by name, ingredient, or glassware. These search filters can be toggled on/off by clicking the respective buttons.

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151066518-5b17a423-35f6-43a5-976e-a2e7ce61d512.png" width=600 />
  <p align="center"><i>My Cocktails Page</i></p>
</p>

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151066597-258e388e-ce54-4378-9f20-2880a77ab8c3.png" width=600 />
  <p align="center"><i>My Cocktails Page - Searching & Filtering on Mobile</i></p>
</p>

### My Favorites Page

The *My Favorites* page is similar in features to the *My Cocktails* page, but will show those cocktails that have been saved. This is needed in addition, since users can save cocktails that they cannot yet make.

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151066731-11b9c0d3-24be-4309-8eb0-8f480cc453db.png" />
  <p align="center"><i>My Favorites Page</i></p>
</p>

### Individual Cocktail Pages

Clicking on a cocktail on any page will bring you to that cocktail’s page. This page displays the cocktails name, a description (if available), directions, the garnish, the glassware, and the recipe. There is also a pair of like/dislike buttons, which are used for recommendations. They are not visible to users who are not signed in.

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151217583-0604d7f5-de99-4d95-ae86-45b60dae48b4.png" width=600 />
  <p align="center"><i>Cocktail Page</i></p>
</p>

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151217588-700a1a65-225f-438d-b3c1-f97c751b2c75.png" width=600 />
  <p align="center"><i>Liking a Cocktail</i></p>
</p>

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151217594-04bd25cd-f700-4740-8060-220963803b86.png" width=600 />
  <p align="center"><i>Disliking a Cocktail</i></p>
</p>

### All Ingredients Page

The *Ingredients* page under the *Explore* navbar menu displays all the ingredients in the database. They are displayed categorized and can be searched similar to the *My Ingredients* page.

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151218082-1dff142b-d651-4d8b-bc64-5a459c28a01b.png" width=600 />
  <p align="center"><i>All Ingredients Page</i></p>
</p>

Selecting an ingredient will display all cocktails containing it.

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151218319-d3735171-ab37-4848-ab06-04632fcbfc4c.png" width=600 />
  <p align="center"><i>Selecting an Ingredient (i.e Prosecco)</i></p>
</p>

### All Cocktails Page

The *Cocktails* page will display all cocktails in the database. They are displayed and can be sorted similarly to the *My Cocktails* page. If a user is not signed in, the heart icons will not be visible.

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151220896-726535fb-10fa-44bd-9a21-b4b7ed89b38b.png" width=600 />
  <p align="center"><i>All Cocktails Page</i></p>
</p>

### Settings Page

The *Settings* page allows users to update their profile name, update their email, update their password, delete their account, and sign out. Info banners will appear similarly to the login page in order to display errors and successful updates.

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151221116-6a934042-a949-452d-9f68-e4ce92af8710.png" width=600 />
  <img src="https://user-images.githubusercontent.com/13024480/151221138-7444c954-6c63-494b-af2f-58ea1086b164.png" width=600 />
  <p align="center"><i>Settings Page</i></p>
</p>

### Recommendations

Ingredients are recommended to users based on the largest number of new cocktails that the user can make if they purchase that ingredient. This is done by comparing the user’s ingredient list to the ingredient lists of all cocktails in the database. 

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151221474-eeac129b-d834-4dd7-9312-3a59ef1708a2.png" width=600 />
  <p align="center"><i>Ingredient Recommendations</i></p>
</p>

Cocktails are recommended to users based on their liked and disliked cocktails. A user’s liked cocktails are compared to those of all other users. The most similar user to the given user is determined and cocktails they've liked that are not in the given user’s like & dislike lists are recommended. If there are no similar users then the user is given recommendations based on the number of similar ingredients between their liked cocktails and the other cocktails in the database. The recommendations tab has a toggle button to only recommend cocktails the user can make.

<p align='center' width='100%'>
  <img src="https://user-images.githubusercontent.com/13024480/151221999-ba60d95e-5c67-4c64-9e1c-ebac6b15826f.png" width=600 />
  <p align="center"><i>Cocktail Recommendations</i></p>
</p>

## Schema Overview (MongoDB)

```
Users
{ userID: uid, 
  email: string,
  password: string (hashed)
  first_name: string,
  last_name: string,
  ingredients: [ingredient_id],
  favorite_cocktails: [cocktail_id],  (i.e saved recipes)
  liked_cocktails: [cocktail_id],
  disliked_cocktails: [cocktail_id]
}


Cocktails
{ cocktail_id: uid,
  name: string,
  subtitle: string (description),
  img: url,
  ingredients: [ { ingredient: ingredient_id, quantity: float, unit: string } ],
  garnish: ingredient_id || None
  directions: string || None,
  glassware: glassware_id,
}

Ingredients
{ ingredient_id: uid,
  name: string,
  category: category_id,
  subcategory: category_id,
}

Glassware
{ glassware_id: uid,
  name: string,
}
```
