import { AuthProvider } from "./context/AuthContext";
import { CustomerProvider } from "./context/CustomerContext";
import { LeadProvider } from "./context/LeadContext";
import { TaskProvider } from "./context/TaskContext";
import { SalesProvider } from "./context/SalesContext";
import { EmailProvider } from "./context/EmailContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <CustomerProvider>
        <LeadProvider>
          <TaskProvider>
            <SalesProvider>
              <EmailProvider>
                <AnalyticsProvider>{children}</AnalyticsProvider>
              </EmailProvider>
            </SalesProvider>
          </TaskProvider>
        </LeadProvider>
      </CustomerProvider>
    </AuthProvider>
  );
};

export default AppProviders;
