import { App } from "./controllers";
import { PostgresConnection } from "./data/PostgresConnection";

const bootStrap = async () => {
  const pgConnection = new PostgresConnection();
  return await App.run(pgConnection);
};

const bootStrapTest = async (connection: PostgresConnection) => {
  return await App.run(connection);
};

bootStrap();
export default bootStrapTest;
