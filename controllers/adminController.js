const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Task = require('../models/Task');
const Sale = require('../models/Sale');
const Email = require('../models/Email');

// Reusable CRUD function generator
const createEntity = (Model) => async (req, res) => {
  try {
    const entity = await Model.create(req.body);
    res.status(201).json(entity);
  } catch (error) {
    console.error(`Error creating ${Model.modelName}:`, error);
    res.status(500).json({ message: `Error creating ${Model.modelName}` });
  }
};

const getEntities = (Model, populateFields = []) => async (req, res) => {
  try {
    let query = Model.find();
    populateFields.forEach(field => query = query.populate(field));
    const entities = await query;
    res.status(200).json(entities);
  } catch (error) {
    console.error(`Error fetching ${Model.modelName}:`, error);
    res.status(500).json({ message: `Error fetching ${Model.modelName}` });
  }
};

const updateEntity = (Model) => async (req, res) => {
  try {
    const entity = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(entity);
  } catch (error) {
    console.error(`Error updating ${Model.modelName}:`, error);
    res.status(500).json({ message: `Error updating ${Model.modelName}` });
  }
};

const deleteEntity = (Model) => async (req, res) => {
  try {
    await Model.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `${Model.modelName} deleted` });
  } catch (error) {
    console.error(`Error deleting ${Model.modelName}:`, error);
    res.status(500).json({ message: `Error deleting ${Model.modelName}` });
  }
};

// 🟢 Leads
const createLead = createEntity(Lead);
const getLeads = getEntities(Lead);
const updateLead = updateEntity(Lead);
const deleteLead = deleteEntity(Lead);

// 🟢 Customers
const createCustomer = createEntity(Customer);
const getCustomers = getEntities(Customer);
const updateCustomer = updateEntity(Customer);
const deleteCustomer = deleteEntity(Customer);

// 🟢 Tasks
const createTask = createEntity(Task);
const getTasks = getEntities(Task);
const updateTask = updateEntity(Task);
const deleteTask = deleteEntity(Task);

// 🟢 Sales
const createSale = async (req, res) => {
  try {
    let customerId = req.body.customer;
    let customerName = 'N/A';

    if (customerId && typeof customerId === 'object' && customerId._id) {
      customerId = customerId._id;
    }

    if (customerId) {
      const customer = await Customer.findById(customerId);
      customerName = customer?.name || customerName;
    }

    const sale = await Sale.create({
      ...req.body,
      customer: customerId,
      customerName,
    });

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

const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("customer");
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
};

const updateSale = async (req, res) => {
  try {
    const saleId = req.params.id;
    let newCustomerId = req.body.customer;

    if (newCustomerId && typeof newCustomerId === 'object' && newCustomerId._id) {
      newCustomerId = newCustomerId._id;
      req.body.customer = newCustomerId;
    }

    const existingSale = await Sale.findById(saleId);
    if (!existingSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

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

    const updatedSale = await Sale.findByIdAndUpdate(saleId, req.body, { new: true });
    res.status(200).json(updatedSale);
  } catch (error) {
    console.error("Error updating sale:", error);
    res.status(500).json({ message: "Failed to update sale" });
  }
};

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

// 🟢 Emails
const createEmail = createEntity(Email);
const getEmails = getEntities(Email);
const updateEmail = updateEntity(Email);
const deleteEmail = deleteEntity(Email);

// 📦 Purchase History by Customer Name
const getPurchaseHistoryByCustomerName = async (req, res) => {
  try {
    const customerName = req.params.name;
    const customer = await Customer.findOne({ name: customerName });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const history = await Sale.find({ customer: customer._id }).populate("customer");
    res.status(200).json(history);
  } catch (err) {
    console.error("Error fetching purchase history:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📊 Analytics (Static Sample Data)
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
  // Leads
  createLead, getLeads, updateLead, deleteLead,

  // Customers
  createCustomer, getCustomers, updateCustomer, deleteCustomer,

  // Tasks
  createTask, getTasks, updateTask, deleteTask,

  // Sales
  createSale, getSales, updateSale, deleteSale,

  // Emails
  createEmail, getEmails, updateEmail, deleteEmail,

  // Analytics
  getAnalytics,

  // Purchase History
  getPurchaseHistoryByCustomerName,
};
