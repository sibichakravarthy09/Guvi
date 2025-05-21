import { useContext, useState, useEffect } from "react";
import { CustomerContext } from "../context/CustomerContext";
import "../styles/Customers.css";
import api from "../services/api";

const Customers = () => {
  const { customers, addCustomer, loadCustomers } = useContext(CustomerContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    setFilteredCustomers(
      customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      )
    );
  }, [searchTerm, customers]);

  const openAddModal = () => {
    setIsEdit(false);
    setCurrentCustomer({ name: "", phone: "", address: "" });
    setModalOpen(true);
  };

  const openEditModal = (customer) => {
    setIsEdit(true);
    setCurrentCustomer(customer);
    setModalOpen(true);
  };

  const handleModalChange = (e) => {
    setCurrentCustomer({ ...currentCustomer, [e.target.name]: e.target.value });
  };

  const handleModalSave = async () => {
    const { name, phone, address, _id } = currentCustomer;
    if (!name || !phone || !address) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/customers/${_id}`, { name, phone, address });
      } else {
        await addCustomer({ name, phone, address }); 
      }
      await loadCustomers(); // Refresh the customer list after add or update
      setModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/customers/${id}`);
      await loadCustomers(); // Refresh after deletion
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Something went wrong.");
    }
  };

  const fetchPurchaseHistory = async (customerName) => {
    setLoadingHistory(true);
    setHistoryError("");
    setPurchaseHistory([]);

    try {
      const response = await api.get(`/customers/${customerName}/purchase-history`);
      const data = response.data;

      setPurchaseHistory(Array.isArray(data) ? data : []);
      setSelectedCustomerName(customerName);
      setHistoryModalOpen(true);
    } catch (error) {
      console.error("Error:", error.message);
      setHistoryError("Unable to fetch history.");
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="customer-container">
      <h1 className="customer-heading">Customers</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Search by name or phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button className="save-btn" style={{ marginBottom: "1rem" }} onClick={openAddModal}>
        + Add Customer
      </button>

      <table className="customer-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Purchase History</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer, index) => (
            <tr key={customer._id}>
              <td>{index + 1}</td>
              <td>{customer.name}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>
                <button
                  className="action-button history-btn"
                  onClick={() => fetchPurchaseHistory(customer.name)}
                >
                  View History
                </button>
              </td>
              <td>
                <button className="action-button edit-btn" onClick={() => openEditModal(customer)}>
                  Edit
                </button>
                <button className="action-button delete-btn" onClick={() => handleDelete(customer._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{isEdit ? "Edit Customer" : "Add Customer"}</h2>
            <input
              type="text"
              name="name"
              placeholder="Customer Name"
              value={currentCustomer.name}
              onChange={handleModalChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={currentCustomer.phone}
              onChange={handleModalChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={currentCustomer.address}
              onChange={handleModalChange}
            />
            <div className="modal-actions">
              <button className="save-btn" onClick={handleModalSave}>
                {isEdit ? "Update" : "Add"}
              </button>
              <button className="cancel-btn" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase History Modal */}
      {historyModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedCustomerName}'s Purchase History</h2>
            {loadingHistory ? (
              <p>Loading history...</p>
            ) : historyError ? (
              <p>{historyError}</p>
            ) : purchaseHistory.length === 0 ? (
              <p>No purchase history available.</p>
            ) : (
              <table className="customer-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistory.map((sale) => (
                    <tr key={sale._id}>
                      <td>₹{sale.amount}</td>
                      <td>
                        {new Date(sale.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setHistoryModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
