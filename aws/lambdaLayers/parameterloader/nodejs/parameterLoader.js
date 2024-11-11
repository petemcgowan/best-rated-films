const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const ssmClient = new SSMClient();

// In-memory cache to store parameter values
const parameterCache = {};

async function getParameter(name) {
  // Check if the parameter is already in the cache
  if (parameterCache[name]) {
    console.log(`Parameter ${name} fetched from cache.`);
    return parameterCache[name];
  }

  // If not in cache, retrieve it from SSM Parameter Store
  console.log(`Fetching parameter ${name} from SSM Parameter Store.`);
  const command = new GetParameterCommand({
    Name: name,
    WithDecryption: true,
  });
  const response = await ssmClient.send(command);

  // Store the retrieved value in the cache
  parameterCache[name] = response.Parameter.Value;

  return response.Parameter.Value;
}

module.exports = { getParameter };
