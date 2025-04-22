import createClient from 'openapi-fetch';

import type { paths } from './types/openapi';

const client = createClient<paths>({ baseUrl: 'http://localhost:5173/' });
export default client;
