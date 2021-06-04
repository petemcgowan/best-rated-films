**Initial update of movieDbId**
db.films.updateMany( { }, { $set: { movieDBID: -1 } } )

I don't need schema because the JSON auto-defines

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
