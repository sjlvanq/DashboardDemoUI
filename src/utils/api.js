const BASE_URL = 'http://localhost:5270/api';

const handleResponse = async (response) => {
  try {
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/problem+json')) {
        const errorData = await response.json();
        console.error('Error data:', errorData);
        throw errorData;
      } else {
        const errorText = await response.text();
        console.error('Error text:', errorText);
        throw new Error(errorText);
      }
    }
    return response.json();
  } catch (error) {
    console.error('Error parsing response:', error);
    throw new Error('Error desconocido al analizar la respuesta del servidor.');
  }
};




const api = {
  post: (endpoint, data) => {
    return fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(handleResponse)
	;
  },
  //GET, PUT, DELETE, etc.
};

export default api;
