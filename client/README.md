# Best Rated Films

For finding the best reviewed films ever

## Architecture

<img src="docs/images/brf-architecture.png" width="100%" />

## What the app is for

This is a full stack system which collates and allows authenticated users to browse films based on how they have been reviewed in Top 100 lists, Best Of Lists e.g. Empire All time 100.

I found I was "running out" of great films to watch and although one can find meta scores on metacritic or rottentomatoes, I felt that there could/should be a way of finding films based on their "top 100 list value".

Of course people who make lists maybe have biases from one year to another, from one publication to another, they're all different. So it would be best to average out these lists to give a score to assess how that film stands in a sort of "Meta-Top 100 list".

It's to stand in addition to reviews, which might be reliable, might not. Marvel Comics movies get good reviews for some reason (e.g. money), but traditionally something like "Dog Day Afternoon" is gonna be on a lot of lists, or "Apocalypse Now Redux", as they have endearing, timeless value. There are also films like "Network", that people just don't know about. I wanted to find more films like that.

Additional functionality includes a "Watched list". Films that have already been seen, can be "checked off" aka marked as watched. This removes them from "film circulation" so the user can concentrate on the films they haven't seen.

There's also a film details page that provides additional details about each film. Many other film features could be added in time.

## Approaches and APIs

This is fundamentally about data wrangling. The more data this system has, the more accurate it can be. Currently it houses Empire's Top 100, etc TODO list em out.

I had to choose between IMDB and TMDB at one point, as it's best to have one source of data. IMDB is more well known but I don't its API is as well developed.

Conversely, TMDB has the IMDB ID, I like their documentation, seems fast, seems an open aPI. IMDB, more closed.
https://www.themoviedb.org/

They both have their OWN ratings per film (IMDB rating and TMDB rating), but that's not quite what this system is about (currently).

## TMDB calls used

TODO: outline how you're using the API exactly per call (and how things like image URL paths are formed etc)

https://developers.themoviedb.org/3/getting-started/introduction

## Technical details

- React JS / ES7 / Webpack
- React Context
- Mobx (state management)
- Redux (login/auth state management)

- MongoDB
- Mongoose
- React Hooks
- Node / Express, Npm
- SCSS / CSS
- Adobe Illustrator

## Main app components

Login Menu
<img src="docs/images/brf-login-menu.png" width="100%" />

Main
<img src="docs/images/brf-main.png" width="100%" />

Main Menu
<img src="docs/images/brf-menu.png" width="100%" />

Page List:
<img src="docs/images/brf-page-list.png" width="100%" />

Watched:
<img src="docs/images/brf-watched.png" width="100%" />

TODO: Get Login modal screenshot.
TODO: Describe Vintage Mode.

## MongoDB - how I use it locally

This is how to start MongoDB (locally). This assumes the database has already been made (see database schema for more on DB creation)

- Open directory: /Users/<username>/mongo/bin
- Then Run: /Users/peteburquette/mongo/bin/mongod --dbpath '/Users/<username>/mongo-data'
  where <username> should be replaced by your user directory (on a Mac)

- Then open: Mongo DB Compass (app).
- Click Connect.
- Click 100 Films DB. (the db name)

TODO? to use environment variables you need a .env file and the package.json dependency of dotenv (.env)

## How the app is started

The database must be running first!
Run npm run dev from the project directory. This will run both the client and server projects concurrently

**address in use** issue - this might arise (known bug!). If it does, find the existent process on the port using this command (will require admin privileges):

sudo lsof -iTCP -sTCP:LISTEN -n -P

...identify the process id from the results (you'll see 5001 or the port in question in the list, the ID is the 2nd column). Then input it as <processid> in the following command and run it

sudo kill -9 <processid>

Then run the system again (npm run dev)

## Database schema

- **films** - this is the "film reference" table. Fundamental information about a film is held here e.g. the rankings that it has.

- **filmstowatch** - This is the films that each USER has watched. When logging in this table is coupled with films to determine what films the user should see in their session

- **users** - registered users of the system

- **watched** - record per user of the films that have already been watched

## Graphic design

TODO: Explain how you did the graphic design, what the origin files are, what and when all the different artifacts are used (apple touch etc)

## Usage

```
npm install

# Run on http://localhost:3000
npm start

# Build for prod
npm run build
```
