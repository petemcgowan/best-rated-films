import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getParameter } from "/opt/nodejs/parameterLoader.js";

const ddbClient = new DynamoDBClient();

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;
    const USERS_TABLE = await getParameter("/rated/tables/UsersTable");
    const JWT_SECRET = await getParameter("/rated/secrets/JwtSecret");

    // Validate input
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: "Please enter all fields" }),
      };
    }

    // Fetch user from DynamoDB by email
    const getUserParams = {
      TableName: USERS_TABLE,
      Key: {
        _id: { S: email }, // email is the primary key
        email: { S: email },
      },
    };

    const userResponse = await ddbClient.send(new GetItemCommand(getUserParams));
    console.log(`userResponse: ${JSON.stringify(userResponse)}`)

    if (!userResponse.Item) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: "User does not exist" }),
      };
    }

    // Extract stored password from the response
    const hashedPassword = userResponse.Item.password.S;
    const userId = userResponse.Item.email.S;
    const userName = userResponse.Item.name.S;

    // Validate password
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: "Invalid credentials" }),
      };
    }

    // Sign the JWT token
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: 3600 });

    // Successful response
    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
        user: {
          id: userId,
          name: userName,
          email: email,
        },
      }),
    };
  } catch (err) {
    console.error("Error authenticating user:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Server Error" }),
    };
  }
};
