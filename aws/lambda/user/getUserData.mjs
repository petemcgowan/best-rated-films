

import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import jwt from "jsonwebtoken";
import { getParameter } from "/opt/nodejs/parameterLoader.js";

const ddbClient = new DynamoDBClient();

export const handler = async (event) => {
  try {
    console.log("Get user data called");

    const USERS_TABLE = await getParameter("/rated/tables/UsersTable");
    const JWT_SECRET = await getParameter("/rated/secrets/JwtSecret");

    // Get token from headers
    const token = event.headers["x-auth-token"];

    // Check for token
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ msg: "No token, authorization denied" }),
      };
    }

    // Verify token and decode user ID
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log (`decoded: ${JSON.stringify(decoded)}`)
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: "Token is not valid" }),
      };
    }

    // Extract user ID from decoded token
    const userId = decoded.email;
    console.log (`userId: ${userId}`)

    // Fetch user data from DynamoDB using the user ID
    const getUserParams = {
      TableName: USERS_TABLE,
      Key: {
        _id: { S: userId },
        email: {S: userId} // Assuming user ID is the primary key
      },
      ProjectionExpression: "#name, email", // Exclude password from result
      ExpressionAttributeNames: {
        "#name": "name",
      },
    };

    const userResponse = await ddbClient.send(new GetItemCommand(getUserParams));
    console.log (`userResponse: ${JSON.stringify(userResponse)}`)

    if (!userResponse.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ msg: "User not found" }),
      };
    }

    // Format the user data to return
    const userData = {
      id: userResponse.Item.email.S,
      name: userResponse.Item.name.S,
      email: userResponse.Item.email.S,
    };

    // Return the user data
    return {
      statusCode: 200,
      body: JSON.stringify(userData),
    };
  } catch (err) {
    console.error("Error retrieving user data:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Server Error" }),
    };
  }
};
