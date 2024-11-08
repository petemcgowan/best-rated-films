import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const FILMS_TABLE = "Films";
const FILMS_TO_WATCH_TABLE = "FilmsToWatch";

export const handler = async (event) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    // Parse incoming request body
    const { title, email } = JSON.parse(event.body);
    console.log("Parsed title:", title);
    console.log("Parsed email:", email);

    // Check if the film exists in the Films table using a scan
    const filmsResult = await docClient.send(
      new ScanCommand({
        TableName: FILMS_TABLE,
        FilterExpression: "#title = :title",
        ExpressionAttributeNames: { "#title": "title" },
        ExpressionAttributeValues: { ":title": title },
      })
    );
    const film = filmsResult.Items && filmsResult.Items[0]; // Assuming unique titles or taking the first match

    if (!film) {
      console.log("Film not found in Films table");
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: "Film not found" }),
      };
    }

    // Create a new film record in FilmsToWatch
    const newFilmItem = {
      _id: `${email}-${title}`,  // Unique ID to avoid duplicates
      email: email,
      title: film.title,
      year: film.year,
      movieDbId: film.movieDbId,
      poster_path: film.poster_path,
      averageRanking: film.averageRanking,
      backdrop_path: film.backdrop_path,
      release_date: film.release_date,
      filmId: film._id,  // Film table ID, renamed for clarity
      director: film.director,
      rankings: film.rankings,
    };

    // Put the item in FilmsToWatch table
    try {
      await docClient.send(
        new PutCommand({
          TableName: FILMS_TO_WATCH_TABLE,
          Item: newFilmItem,
        })
      );
      console.log("Film successfully added to FilmsToWatch");
    } catch (putError) {
      console.error("Error adding film to FilmsToWatch:", putError);
      throw putError; // Re-throw to trigger main catch block
    }

    // Return the created film item
    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        data: newFilmItem,
      }),
    };
  } catch (error) {
    console.error(`Error in addFilm: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Server Error",
      }),
    };
  }
};
