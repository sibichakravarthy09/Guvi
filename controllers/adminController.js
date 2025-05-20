const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Task = require('../models/Task');
const Sale = require('../models/Sale');
const Email = require('../models/Email');
const Analytics = require('../models/Analytics');


// Generic CRUD function generator
const createEntity = (Model) => async (req, res) => {
  try {
    console.log('Received body:', req.body);
    const entity = await Model.create(req.body);
    res.status(201).json(entity);
  } catch (error) {
    console.error(`Error creating ${Model.modelName}:`, error); 
    res.status(500).json({ message: `Error creating ${Model.modelName}` });
  }
};

// Get all entities, with optional population
const getEntities = (Model, populateFields = []) => async (req, res) => {
  try {
    let query = Model.find();
    if (populateFields.length > 0) {
      populateFields.forEach(field => {
        query = query.populate(field);
      });
    }
    const entities = await query;
    res.status(200).json(entities);
  } catch (error) {
    res.status(500).json({ message: `Error fetching ${Model.modelName}` });
  }
};

const updateEntity = (Model) => async (req, res) => {
  try {
    const entity = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(entity);
  } catch (error) {
    res.status(500).json({ message: `Error updating ${Model.modelName}` });
  }
};

const deleteEntity = (Model) => async (req, res) => {
  try {
    await Model.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `${Model.modelName} deleted` });
  } catch (error) {
    res.status(500).json({ message: `Error deleting ${Model.modelName}` });
  }
};

// CRUD handlers
const createLead = createEntity(Lead);
const getLeads = getEntities(Lead);
const updateLead = updateEntity(Lead);
const deleteLead = deleteEntity(Lead);

const createCustomer = createEntity(Customer);
const getCustomers = getEntities(Customer);
const updateCustomer = updateEntity(Customer);
const deleteCustomer = deleteEntity(Customer);

const createTask = createEntity(Task);
const getTasks = getEntities(Task);
const updateTask = updateEntity(Task);
const deleteTask = deleteEntity(Task);

const createSale = async (req, res) => {
  try {
    let customerId = req.body.customer;
    let customerName = 'N/A';

    // Handle if customer is sent as an object (e.g., from a dropdown)
    if (customerId && typeof customerId === 'object' && customerId._id) {
      customerId = customerId._id;
    }

    // Fetch customer's name from DB
    if (customerId) {
      const customer = await Customer.findById(customerId);
      if (customer?.name) {
        customerName = customer.name;
      }
    }

    // Create the sale with the customer ID and name
    const sale = await Sale.create({
      ...req.body,
      customer: customerId,   // Ensure only the ID is saved
      customerName,           // Save snapshot of customer name
    });

    // Optional: Update customer's purchase history
    if (customerId) {
      await Customer.findByIdAndUpdate(customerId, {
        $push: { purchaseHistory: sale._id },
      });
    }

    res.status(201).json(sale);
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Failed to create sale" });
  }
};




// Get all sales with populated customer data
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("customer");
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
};

// Update a sale and update customer's purchase history if changed
const updateSale = async (req, res) => {
  try {
    const saleId = req.params.id;
    let newCustomerId = req.body.customer;

    // Handle customer object sent from frontend
    if (newCustomerId && typeof newCustomerId === 'object' && newCustomerId._id) {
      newCustomerId = newCustomerId._id;
      req.body.customer = newCustomerId;
    }

    const existingSale = await Sale.findById(saleId);
    if (!existingSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // If customer changed, update both old and new customer's purchase history
    if (existingSale.customer?.toString() !== newCustomerId) {
      if (existingSale.customer) {
        await Customer.findByIdAndUpdate(existingSale.customer, {
          $pull: { purchaseHistory: saleId },
        });
      }

      if (newCustomerId) {
        await Customer.findByIdAndUpdate(newCustomerId, {
          $push: { purchaseHistory: saleId },
        });
      }
    }

    const updatedSale = await Sale.findByIdAndUpdate(saleId, req.body, {
      new: true,
    });

    res.status(200).json(updatedSale);
  } catch (error) {
    console.error("Error updating sale:", error);
    res.status(500).json({ message: "Failed to update sale" });
  }
};


// Delete a sale and remove it from customer's purchase history
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);

    if (sale?.customer) {
      await Customer.findByIdAndUpdate(sale.customer, {
        $pull: { purchaseHistory: sale._id },
      });
    }

    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    res.status(500).json({ message: "Failed to delete sale" });
  }
};

const createEmail = createEntity(Email);
const getEmails = getEntities(Email);
const updateEmail = updateEntity(Email);
const deleteEmail = deleteEntity(Email);

// 📦 Get purchase history by customer name
const getPurchaseHistoryByCustomerName = async (req, res) => {
  try {
    const customerName = req.params.name;

    // Step 1: Find the customer by name
    const customer = await Customer.findOne({ name: customerName });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Step 2: Find all sales associated with this customer
    const purchaseHistory = await Sale.find({ customer: customer._id }).populate("customer");

    res.status(200).json(purchaseHistory);
  } catch (err) {
    console.error("Error fetching purchase history:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 📊 Analytics summary
const getAnalytics = async (req, res) => {
  try {
    const analyticsData = {
      totalLeads: 20,
      totalSales: 140,
      totalCustomers: 85,
      taskCompletionRate: 92,
      reportDate: new Date(),
      salesByStage: [
        { stage: "Stage 1", value: 1000 },
        { stage: "Stage 2", value: 2000 },
        { stage: "Stage 3", value: 1500 },
        { stage: "Stage 4", value: 1800 },
      ],
      topCustomers: [
        { name: "Nexora", value: 50 },
        { name: "Vironix", value: 66 },
        { name: "Zentbyte", value: 33 },
        { name: "Techspire", value: 43 },
      ],
      monthlyRevenue: [
        { month: "Jan", revenue: 3000 },
        { month: "Feb", revenue: 4000 },
        { month: "Mar", revenue: 5000 },
        { month: "Apr", revenue: 6000 },
      ],
    };

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics data" });
  }
};

module.exports = {
  createLead, getLeads, updateLead, deleteLead,
  createCustomer, getCustomers, updateCustomer, deleteCustomer,
  createTask, getTasks, updateTask, deleteTask,
  createSale, getSales, updateSale, deleteSale,
  createEmail, getEmails, updateEmail, deleteEmail,
  getAnalytics,
  getPurchaseHistoryByCustomerName, // ✅ This will now work
};

