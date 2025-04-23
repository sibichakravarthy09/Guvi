import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import { LeadProvider } from "./context/LeadsContext";
import { SalesProvider } from "./context/SalesContext";
import { EmailProvider } from "./context/EmailContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import { CustomerProvider } from "./context/CustomerContext"; // ✅ Add this line

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter> {/* Move BrowserRouter here */}
    <AuthProvider>
      <CustomerProvider> {/* ✅ Wrap all contexts here */}
        <TaskProvider>
          <LeadProvider>
            <SalesProvider>
              <EmailProvider>
                <AnalyticsProvider>
                  <App />
                </AnalyticsProvider>
              </EmailProvider>
            </SalesProvider>
          </LeadProvider>
        </TaskProvider>
      </CustomerProvider>
    </AuthProvider>
  </BrowserRouter>
);
