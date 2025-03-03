interface Env {
  REACT_APP_USE_NEO_DB: boolean;
  REACT_APP_NEO_CONN_STRING: string;
  REACT_APP_NEO_PASSWORD: string;
}

export const env: Env = {
  REACT_APP_USE_NEO_DB: process.env.REACT_APP_USE_NEO_DB === "true" || false,
  REACT_APP_NEO_CONN_STRING: process.env.REACT_APP_NEO_CONN_STRING || "",
  REACT_APP_NEO_PASSWORD: process.env.REACT_APP_NEO_PASSWORD || "",
};
