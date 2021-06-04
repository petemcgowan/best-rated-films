**Manual corrects:**

DONE:

- Cinema Paradiso - is this an anglicized name? Nuevo Cinema Pariso need to decide on which is the best name to be book of record! DBID: 11216 Solution: switched from original_title to title in the search
- Spirited Away - Title switch
- Scarface this is bound to be an issue (although it's not on the list! TODO: Rectify this)
- Sunset Boulevard -names differ - changing name
- Princess Mononoke - names differ? Title Switch
- Pan's Labyrinth - names differ? - Title Switch
- Amélie is TMDB missing the release date for the correct version? Mine comes up blank, try a query - Title Switch
- The Seven Samurai - names differ? - No 'The' / Title Switch
- Rashomon - the o has an accent, but isn't the compare supposed to take care of that? Title Switch
- Grave of the Fireflies - names differ? - update changes worked
- THE WILD BUNCH - this is ok, but it shouldn't be in caps in my version (nothing should)
- The Silence of the Lambs - ok now but there was a space at the end of it, so I'm putting in a trim: update changes worked
- Once Upon A Time In The West - I don't think it can find this, try a query or search update: changes worked
- Star Wars: Episode VI - Return of the Jedi - names differ? NOTE: Return of The Jedi is in there too, thanks George Lucas. Might just include the original. Update "Return of the Jedi" it is
- Star Wars: Episode V - The Empire Strikes Back - names differ? - changed to "The Empire Strikes Back", then it works
- E.T - names differ update: changes worked
- Avengers Assemble - names differ? banned for being shit? update: this is known as "The Avengers" in the US, so I'm updating to that. And the nerds are talking about the 2012 "classic" so manual update to 24428
- The Good, The Bad and the Ugly - names differ? - update: changes worked
- City Of God - names differ - there's an earlier one - updated to 598
- The Wizard Of Oz had a 1925 release! updated manually to 630
- When Harry Met Sally - There's a "..." on TMDB, which is the correct spelling? update: ignorePunctuation: true sorts this out
- Bicycle Thieve - That's not a word! Should be Thief surely... Update: It's "Bicycle Thieves"/updated
- Whiplash - there's a 1948 version, which is the right one? There's a scatter: Manual update to 244786
- The Lives of Others - names differ?
- The Franch Connection - as in salad dressing? 😂 update!

This shows that there's no way I can't have the movieDbId beforehand, as I have no idea of knowing which Wizard Of Oz it is. That kind of brings me back to **admin account** that changes the nature of the onClickEvent to be dbid or other related vs watched removal etc.

You could probably do this using admin@admin.com with a suitable password. There could be **admin flag in the users table** which denotes admin capability. These can be set up at register time, but updated afterwards to be admin so no need for admin checkbox on register, the default would be false.
