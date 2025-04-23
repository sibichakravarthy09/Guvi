import axios from "axios";

const API_URL = "http://localhost:5000/api/analytics";

const getAnalytics = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export default { getAnalytics };
