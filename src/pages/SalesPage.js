import React, { useState, useEffect } from "react";
import { useSales } from "../context/SalesContext";
import { useCustomers } from "../context/CustomerContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../styles/SalesPage.css";

const topStages = ["Lead", "Qualified", "Proposal"];
const bottomStages = ["Negotiation", "Closed"];

const SalesPage = () => {
  const { sales = [], addNewSale, deleteSale, updateSale } = useSales();
  const { customers = [], loadCustomers } = useCustomers();

  const [formData, setFormData] = useState({
    dealName: "",
    customer: "",
    amount: "",
    stage: "Lead",
  });

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingSaleId, setEditingSaleId] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const saleData = {
      ...formData,
    };

    if (editMode && editingSaleId) {
      await updateSale(editingSaleId, saleData);
    } else {
      await addNewSale(saleData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ dealName: "", customer: "", amount: "", stage: "Lead" });
    setShowForm(false);
    setEditMode(false);
    setEditingSaleId(null);
  };

  const handleDelete = async (id) => {
    if (typeof deleteSale === "function") {
      await deleteSale(id);
    } else {
      console.error("deleteSale is not a function");
    }
  };

  const handleEdit = (sale) => {
    setFormData({
      dealName: sale.dealName,
      customer: typeof sale.customer === "object" ? sale.customer._id : sale.customer,
      amount: sale.amount,
      stage: sale.stage,
    });
    setEditMode(true);
    setEditingSaleId(sale._id);
    setShowForm(true);
  };

  const onDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;

    const updatedSale = sales.find((s) => s._id === draggableId);
    if (updatedSale) {
      await updateSale(draggableId, {
        ...updatedSale,
        stage: destination.droppableId,
      });
    }
  };

  const getCustomerNameById = (customerId) => {
    const customer = customers.find((c) => c._id === customerId);
    return customer ? customer.name : "N/A";
  };

  const renderDroppableColumn = (stage) => (
    <Droppable droppableId={stage} key={stage}>
      {(provided) => (
        <div
          className="pipeline-column"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h3>{stage}</h3>
          {sales
            .filter((sale) => sale.stage === stage)
            .map((sale, index) => (
              <Draggable key={sale._id} draggableId={sale._id} index={index}>
                {(provided) => (
                  <div
                    className="pipeline-card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className="card-header">
                      <div className="card-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(sale)}
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(sale._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <strong>{sale.dealName}</strong>
                    <p>Value: ₹{sale.amount}</p>
                    <p>
                      Customer:{" "}
                      {typeof sale.customer === "object"
                        ? sale.customer?.name || "N/A"
                        : getCustomerNameById(sale.customer)}
                    </p>
                  </div>
                )}
              </Draggable>
            ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <div className="sales-page">
      <div className="sales-header">
        <h2>Sales Pipelines</h2>
        <button
          className="add-sale-btn"
          onClick={() => {
            setShowForm(true);
            setEditMode(false);
            setFormData({ dealName: "", customer: "", amount: "", stage: "Lead" });
          }}
        >
          + Add Deal
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? "Edit Deal" : "Add New Deal"}</h3>
            <form className="sale-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="dealName"
                placeholder="Deal Name"
                value={formData.dealName}
                onChange={handleChange}
                required
              />
              <select
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
              >
                {[...topStages, ...bottomStages].map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
              <div className="modal-actions">
                <button
                  type="submit"
                  disabled={
                    !formData.dealName ||
                    !formData.customer ||
                    !formData.amount
                  }
                >
                  {editMode ? "Update" : "Save"}
                </button>
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="pipeline-wrapper">
          <div className="pipeline-row top">
            {topStages.map(renderDroppableColumn)}
          </div>
          <div className="pipeline-row bottom">
            {bottomStages.map(renderDroppableColumn)}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default SalesPage;
