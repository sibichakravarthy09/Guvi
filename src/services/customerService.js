import axios from "axios";

const API_URL = "http://localhost:5000/api/customers";

const getCustomers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const addCustomer = async (customerData) => {
  const response = await axios.post(API_URL, customerData);
  return response.data;
};

const updateCustomer = async (id, customerData) => {
  const response = await axios.put(`${API_URL}/${id}`, customerData);
  return response.data;
};

const deleteCustomer = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export default { getCustomers, addCustomer, updateCustomer, deleteCustomer };
