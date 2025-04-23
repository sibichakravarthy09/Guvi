import { useContext, useState, useEffect } from "react";
import { CustomerContext } from "../context/CustomerContext";
import "../styles/Customers.css";

const Customers = () => {
  const { customers, addCustomer, fetchCustomers } = useContext(CustomerContext);
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
        const res = await fetch(`http://localhost:5000/api/admin/customers/${_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, address }),
        });
        if (!res.ok) throw new Error("Failed to update customer.");
      } else {
        await addCustomer({ name, phone, address }); // Already in context
      }
      fetchCustomers(); // Refresh list
      setModalOpen(false);
    } catch (error) {
      alert(error.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this customer?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/customers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete customer.");
      fetchCustomers();
    } catch (error) {
      alert(error.message || "Something went wrong.");
    }
  };

  const fetchPurchaseHistory = async (customerName) => {
    setLoadingHistory(true);
    setHistoryError("");
    setPurchaseHistory([]);

    try {
      const response = await fetch(`http://localhost:5000/api/admin/customers/${customerName}/purchase-history`);
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch history: ${errorText}`);
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setPurchaseHistory(Array.isArray(data) ? data : []);
      } else {
        const nonJsonText = await response.text();
        console.warn("Non-JSON response:", nonJsonText);
        setPurchaseHistory([]);
      }

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
                      <td>{new Date(sale.date).toLocaleDateString("en-IN", {
                        year: "numeric", month: "short", day: "numeric",
                      })}</td>
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
