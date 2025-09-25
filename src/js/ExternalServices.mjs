const baseURL = import.meta.env.VITE_SERVER_URL;

<<<<<<< HEAD
async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
=======
function convertToJson(res) {
  return res.ok
    ? res.json()
    : res.json().then(err => {
        const message =
          typeof err === "object" ? JSON.stringify(err) : err;
        throw { name: "servicesError", message };
      });
>>>>>>> 19ac56203e95b26221fc1b9ec01f8eb70ed67c32
}

export default class ExternalServices {
  constructor() {}
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category} `);
    const data = await convertToJson(response);
    return data.Result;
  }
  
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    console.log(data.Result);
    return data.Result;
  }
  
  async sendData(order) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    };

    const response = await fetch(`${baseURL}checkout`, options);
    return await convertToJson(response);
  }
}