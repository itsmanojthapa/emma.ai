import "dotenv/config";

const getENV = (param: { key: string }) => {
  const value = process.env[param.key];
  if (!value) {
    console.log(`❌ Environment variable ${param.key} is not set`);
  }
  return value;
};

export { getENV };
