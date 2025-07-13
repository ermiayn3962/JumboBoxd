
export const apiCall = async (url, method, body, token) => {

  // add '/' to the beginning of the url if it is not there
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  let response;
  try {
    console.log(import.meta.env.VITE_BASE_URL + url)
    console.log("The .env file")
    console.log(import.meta.env)
    response = await fetch(import.meta.env.VITE_BASE_URL + url, {
      method: method,
      headers: {
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), 
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },

      body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
    });
  } catch (error) {
    console.error('Error in apiCall:', error);
    throw { status: 500, statusText: 'Error in apiCall' };
  }

  if (!response.ok) {
    console.error(response);
    throw { status: response.status, statusText: response.statusText };
  }

  const contentType = response.headers.get('content-type');
  if (!contentType) {
    console.error('Invalid content type:', contentType);
    throw { status: 500, statusText: 'Invalid content type' };
  }

  if (contentType.includes('application/json')) {
    return await response.json();
  }
  
  return { message: await response.text()};
};