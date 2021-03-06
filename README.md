# Campark


## Description

This is a website where the user can find places to park their camper or car overnight. The user can also add places and help other adventurers who are looking for a place to stay.

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **userProfile** - As a user I want to access my profile and see which places I added and in which places I already stayed
- **userAccount** - As a user I want to be able to edit or delete my profile
- **mapPage** - As a user I want to see all the places that me and other users pinned as a good spot to park a campervan or car at night


## Backlog
(See Trello for more infos.)

List of other features outside of the MVPs scope

Website:
- switch languages (german and portuguese)

UserProfile:
- see other users profile

UserAccount:
- upload the user's profile picture
- account recovery

MapPage:
- let the user add images and more informations (like rating for security, cleaning) for each place


## ROUTES:
(The routes are not up to date.)

- GET /
  - renders the homepage (homepage.hbs)

- GET /signup
  - renders the signup form (signup.hbs)

- POST /signup
  - redirects to /profile if user logged in
  - if something goes wrong renders the signup form again with an error message (signup.hbs)
  - body:
    - username
    - country
    - email
    - password

- GET /login
  - renders the signin form (signin.hbs)

- POST /login
  - redirects to /profile if user logged in
  - body:
    - username
    - password
    - if something goes wrong renders the signin form again with an error message (signin.hbs)

- POST /logout
  - redirects to /

- GET /profile
  - renders the profile

- GET /profile/account
  - renders the profile detail page (account.hbs)

- GET /profile/account/:id/edit
  - renders the account form to edit (account-edit.hbs)

- POST /profile/account/:id/edit
  - redirects to /profile/account if everything goes well
  - if something goes wrong renders the edit form again with an error message (account-edit.hbs)

- GET /places
    - render the map page (map.hbs)
    - if the user clicks in a pin, shows the details of the place in the same MapPage
    - if the user clicks in a local where there is no pin, shows an option to user add a new place

- POST /places
 - when the user clicks in submit a new place, shows a message saying that the location was successfully added

## Models

User model

```
username: String,
password: String,
email: String,
country: String,
googleID: String,
profilePic: String,
placesAdded: ObjectId<Place>,
placesVisited: ObjectId<Place>,
timestamps: true
```

Place model

```
latitude: Number,
longitude: Number,
address: String,
description: String,
price: String,
rate: Number,
authorId: ObjectId<User>
image: String,
reviews: ObjectId<Review>

```
Review model

```
rate: Number,
date: String,
comment: String,
userId: ObjectId<User>
placeId: ObjectId<Place>

```

## Links

### API
https://nominatim.org/release-docs/develop/api/Reverse/

https://nominatim.org/release-docs/develop/api/Search/

### Map Library

https://leafletjs.com/

### Trello

https://trello.com/b/xVtGtFB5/project-2


### User Flow
https://whimsical.com/project2-3f8nwCvyLoUsXg36Xbk4SY

### Wireframes
Hi-fi:
https://www.figma.com/file/uSojqSh6FUdwDluCRKVyb5/Untitled?node-id=0%3A1

Mid-fi:
https://whimsical.com/mid-fi-ANxGLpKBH9jvDcHJm4Qvhj

### Git

[Repository Link](https://github.com/Joanneseiler/campark)

[Deploy Link](https://campark-app.herokuapp.com/map)

### Slides

[Slides Link](https://drive.google.com/file/d/1DT7e2nw0LnM5XHEzo2p4nNTvoILiRWdT/view?usp=sharing)
