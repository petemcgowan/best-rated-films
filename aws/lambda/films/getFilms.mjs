// Import AWS SDK for DynamoDB
//import AWS from "aws-sdk";
//const dynamodb = new AWS.DynamoDB.DocumentClient();

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getParameter } from "/opt/nodejs/parameterLoader.js";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

//const FILMS_TABLE = "Films";
//const FILMS_TO_WATCH_TABLE = "FilmsToWatch";

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));  // Log the incoming event

//exports.handler = async (event) => {
  try {
    const FILMS_TABLE = await getParameter("/rated/tables/FilmsTable");
    const FILMS_TO_WATCH_TABLE = await getParameter("/rated/tables/FilmsToWatchTable");

    // Parse incoming data from event
    const { email, vintageMode } = JSON.parse(event.body);
    console.log("Parsed email:", email);
    console.log("Parsed vintageMode:", vintageMode);

    // Fetch all films from DynamoDB
    console.log("Fetching films from DynamoDB...");
    const filmsResult = await docClient.send(
      new ScanCommand({ TableName: FILMS_TABLE })
    );
    const films = filmsResult.Items;
    console.log("Films retrieved:", films.length);

     // Fetch user-specific films to watch using QueryCommand
    console.log("Fetching films to watch for email:", email);
    const filmsToWatchResult = await docClient.send(
      new ScanCommand({
        TableName: FILMS_TO_WATCH_TABLE,
        FilterExpression: "#email = :email",
        ExpressionAttributeNames: {
          "#email": "email",
        },
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
    );
    const filmsToWatch = filmsToWatchResult.Items;
    console.log("Films to watch retrieved:", filmsToWatch.length); // Log number of films to watch

    // Combine Films and FilmsToWatch data
    const vintageDate = new Date("1968-01-01");
    const filteredFilms = [];
    for (const filmToWatch of filmsToWatch) {
      const matchingFilm = films.find((film) => film.title === filmToWatch.title);
      if (matchingFilm) {
        const releaseCompareDate = new Date(matchingFilm.release_date);
        if (vintageMode || releaseCompareDate > vintageDate) {
          filteredFilms.push({
            _id: filmToWatch._id,
            filmId: matchingFilm._id, // calling it filmId for clarity
            email: filmToWatch.email,
            title: filmToWatch.title,
            year: new Date(matchingFilm.release_date).getFullYear(),
            director: matchingFilm.director,
            poster_path: matchingFilm.poster_path,
            backdrop_path: matchingFilm.backdrop_path,
            averageRanking: matchingFilm.averageRanking,
            release_date: matchingFilm.release_date,
            movieDbId: matchingFilm.movieDbId,
            rankings: matchingFilm.rankings,
          });
        }
      }
    }

    // Sort the filtered films by average ranking
    filteredFilms.sort((film1, film2) => film1.averageRanking - film2.averageRanking);

    // Response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        count: filteredFilms.length,
        data: filteredFilms,
      }),
    };
  } catch (error) {
    console.error(`Error fetching films: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Server Error",
      }),
    };
  }
};
