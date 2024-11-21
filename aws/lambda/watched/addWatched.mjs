import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { getParameter } from "/opt/nodejs/parameterLoader.js";

const client = new DynamoDBClient({});
//const WATCHED_TABLE = process.env.WATCHED_TABLE;

export const handler = async (event) => {
  try {
    // Parse the body of the request
    console.log("Received event:", JSON.stringify(event, null, 2));  // Log the incoming event
    const { title, email } = JSON.parse(event.body);
    console.log(`Parsed email:${email}, title:${title}`);

    const WATCHED_TABLE = await getParameter("/rated/tables/WatchedTable");
    console.log(`Parameter retrieved: ${WATCHED_TABLE}`);

    // Generate a unique ID or use a composite key structure
    const id = `${email}-${title}`;

    // Define the new item to insert
    const newItem = {
      _id: id,
      email: email,
      title: title,
      createdAt: new Date().toISOString(),
    };
    console.log(`Creating newItem: ${JSON.stringify(newItem)}`);

    // Insert the item into the Watched table
    await client.send(new PutCommand({
      TableName: WATCHED_TABLE,
      Item: newItem
    }));

    // Return a success response
    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        data: newItem,
      }),
    };
  } catch (err) {
    console.error(`addWatched error: ${err}`);

    // Handle DynamoDB Validation errors
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
