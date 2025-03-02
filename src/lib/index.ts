import createClient from "openapi-fetch"

import type { paths } from "./types/openapi";

const client = createClient<paths>()
export default client;
