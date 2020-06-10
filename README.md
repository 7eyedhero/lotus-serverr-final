# LOTUS: THE GAME (SERVER)
* Back-end framework providing data to the LOTUS app
* Link to live server: <https://calm-sands-81244.herokuapp.com>

# Table of Contents
* [Characters Endpoint](#characters-endpoint)
* [Members Endpoint](#members-endpoint)
* [Quests Endpoint](#quests-endpoint)

# Endpoints

## Characters endpoint 

### GET /api/characters

Gets all the characters from the database.

### GET /api/characters/:user

Gets a single character based on currently logged on user.

### POST api/characters

## Members Endpoint

### POST /api/members

Creates a new member in the database.

**Response: 200 OK**

## Quests Endpoint

### GET /api/quests

Returns an array of all aquests from the database. 

**Response: 200 OK**

### GET /api/quests/own

Gets quests based on current user logged on.

### GET /api/quests/:questId

Returns specified quest.

### POST api/quests

Posts quest results to database.