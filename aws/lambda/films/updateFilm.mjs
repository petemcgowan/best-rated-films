import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getParameter } from "/opt/nodejs/parameterLoader.js";

const client = new DynamoDBClient({});
//const FILMS_TABLE = process.env.FILMS_TABLE;

export const handler = async (event) => {
  try {
    // Parse the film ID from path parameters
    const { id } = event.pathParameters;
    const FILMS_TABLE = await getParameter("/rated/tables/FilmsTable");

    // Parse the body to get the update fields
    const { movieDbId, poster_path, averageRanking, release_date, backdrop_path } = JSON.parse(event.body);

    // Define update expression and expression attribute values
    const updateExpression = `
      SET movieDbId = :movieDbId,
          poster_path = :poster_path,
          averageRanking = :averageRanking,
          release_date = :release_date,
          backdrop_path = :backdrop_path
    `;

    const expressionAttributeValues = {
      ":movieDbId": movieDbId,
      ":poster_path": poster_path,
      ":averageRanking": averageRanking,
      ":release_date": release_date,
      ":backdrop_path": backdrop_path,
    };

    // Update item in the Films table
    await client.send(new UpdateCommand({
      TableName: FILMS_TABLE,
      Key: { _id: id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "UPDATED_NEW",  // To get updated attributes in the response if needed
    }));

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: { id },
      }),
    };
  } catch (err) {
    console.error("updateFilm error:", err);

    // Handle validation errors
    if (err.name === "ValidationException") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: err.message,
        }),
      };
    }

    // General error response
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Server Error",
      }),
    };
  }
};
