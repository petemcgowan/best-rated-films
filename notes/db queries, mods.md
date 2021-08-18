# update averageRanking with the average of the embedded rank field within the rankings objects

db.films.updateMany(
{ },
[
{ $set: { averageRanking : { $trunc: [ { $avg: "$rankings.rank" }, 0 ] } } }
]
)

-- Note the above is derived from:
https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#update-with-aggregation-pipeline

## group rankings into a flat collection, then average (I didn't use this per se)

db.films.aggregate(
{ $unwind: "$rankings" },
{ $set: {averageRanking:  { $group : { _id: "$title", averageRanking : { $avg : "$rankings.rank" } } }}}
);

## convert ranking from string to integer (abandoned for time)

db.films.find({rankings.rank: {$exists: true}}).forEach(function(obj) {
obj.rank = new NumberInt(obj.rank);
db.films.save(obj);
});

## remove ranking TODO fields, cause I forget what I even did that for

db.films.update(
{ },
{ $pull: { rankings: { ranker: "OTHER" , rank: "todo" } } },
{ multi: true }
)

## Add DB field to Mongo (existing table)

db.films.updateMany( { }, { $set: { movieDBID: -1 } } )

db.films.updateMany( { }, { $set: { averageRanking: -1.00 } } )

I don't need schema because the JSON auto-defines

## What database is current

db

# Choose different db

use BestRatedFilms

**Changing of movieDbId**

**Update the DB column name**
db.films.update({}, {$rename:{"movieDBID":"movieDbId"}}, false, true);

Note: Eventually gonna have to remove director and year (currently hardcoded) or I could store them in a new film_details table for faster retrieval (assuming that would be faster)

**Query for specific film**
{title:"Citizen Kane"}

**Query for naughty movies with no ID**
{movieDbId:-1}

**Query for email**
{email:"May28B@gmail.com"}

**Query for email/title**
{email:"May28B@gmail.com", title:"The Silence of the Lambs"}

**Qeuerying for a specific ID and object in Mongo DB Compass** (prettier keeps putting in that backslash take it out!)
<<{\_id: ObjectId("5fe01ecc67e1626c3403fd89")}>>

**Adding New fields to DB (poster_path, release_date, backdrop_path)**

db.films.update(
{},
{ $set: {release_date: "", backdrop_path: "", "poster_path": ""} },
false,
true
)

**dummy temp update for movieDbId**

db.films.update(
{},
{ $set: {movieDbId: 28257} },
false,
true
)

**find rankings that are set to "OTHER"**

{rankings:{$elemMatch:{ranker : "OTHER"}}}
