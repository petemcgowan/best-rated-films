import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const WATCHED_TABLE = "Watched";
const EMAIL_INDEX = "email-index";

export const handler = async (event) => {
  try {
    // Parse the email from the request body
    const { email } = JSON.parse(event.body);

    console.log(`Fetching watched films for email: ${email}`);

    // Query the Watched table for items with the given email
    const watchedFilms = await docClient.send(new QueryCommand({
      TableName: WATCHED_TABLE,
      IndexName: EMAIL_INDEX,
      KeyConditionExpression: "#email = :email",
      ExpressionAttributeNames: {
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":email": email,
      },
    }));

    console.log(`Fetched ${watchedFilms.Items.length} watched films`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: watchedFilms.Items,
      }),
    };
  } catch (err) {
    console.error(`Error fetching watched films: ${err}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Server Error",
      }),
    };
  }
};
