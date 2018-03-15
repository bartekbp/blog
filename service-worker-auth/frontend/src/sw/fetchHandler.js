import parse from 'url-parse';

const getAuthTokenHeader = async () => {
  const allClients = await self.clients.matchAll();
  const client = allClients.filter(client => client.type === 'window')[0];

  console.debug('Requesting auth token header from app');
  if(!client) {
    return null;
  }

  const channel = new MessageChannel();
  client.postMessage({
    'action': 'getAuthTokenHeader'
  }, [channel.port1]);

  return new Promise((resolve, reject) => {
    channel.port2.onmessage = event => {
      if (event.data.error) {
        console.error('Port error', event.error);
        reject(event.data.error);
      }

      resolve(event.data.authHeader);
    }
  });
};

const getResponse = async request => {
  const headers = {};
  for (let entry of request.headers) {
    headers[entry[0]] = headers[entry[1]];
  }

  const token = await getAuthTokenHeader();
  if(token === null) {
    if(request.mode === 'navigate') {
      return new Response(null, {
        status: 302,
        statusText: 'Found',
        headers: new Headers({
          'location': '/login',
        })
      })
    }

    return new Response(null, {
      status: 401,
      statusText: 'Unauthorized'
    });
  }

  headers['Authorization'] = token;
  const body = await ['HEAD', 'GET'].includes(request.method) ? Promise.resolve() : request.text();
  const bodyObj = body ? {body,}: {};

  return fetch(new Request(request.url, {
    method: request.method,
    headers,
    cache: request.cache,
    mode: 'cors',
    credentials: request.credentials,
    redirect: 'manual',
    ...bodyObj,
  }));
};

export default fetchEvent => {
  const request = fetchEvent.request;
  const parsed = parse(request.url);

  if(!parsed.pathname.startsWith('/api')) {
    console.debug('Bypass sw on non api endpoint');
    fetchEvent.respondWith(fetch(request));
    return;
  }

  if(parsed.pathname === '/api/auth') {
    console.debug('Bypass sw on api auth');
    fetchEvent.respondWith(fetch(request));
    return;
  }

  if(request.mode === 'navigate' && request.method === 'POST') {
    console.log('Bypass sw on post navigation');
    fetchEvent.respondWith(fetchEvent(request));
    return;
  }

  fetchEvent.respondWith(getResponse(request));
};