import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const WATCHED_TABLE = "Watched";

export const handler = async (event) => {
  const { id, title } = event.pathParameters;

  try {
    console.log(`deleteWatched called with id: ${id} and title:${title}`);

    // Check if the item exists
    const watchedItem = await docClient.send(new GetCommand({
      TableName: WATCHED_TABLE,
      Key: { _id: id,
         title: title }
    }));
    if (!watchedItem.Item) {
      console.log(`the watched item does not exist: ${id}`);
      return {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          error: "No watched item found",
        }),
      };
    } else {
      console.log(`the watched item DOES: ${id}`);
    }

    // Delete the item
    await docClient.send(new DeleteCommand({
      TableName: WATCHED_TABLE,
      Key: { _id: id,
         title: title }
    }));

    console.log(`Watched item with id ${id} successfully deleted`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: {},
      }),
    };
  } catch (err) {
    console.error(`deleteWatched error: ${err}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Server Error",
      }),
    };
  }
};
