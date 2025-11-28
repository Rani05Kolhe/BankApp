import { lazy, Suspense } from "react";
import Guard from "../components/Gaurd";
import Loader from "../components/Loader";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Homepage = lazy(() => import("../components/Home"));
const Dashboard = lazy(() => import("../components/Admin"));
const NewEmployee = lazy(() => import("../components/Admin/NewEmployee"));
const PageNotFound = lazy(() => import("../components/PageNotFound"));
const Branding = lazy(() => import("../components/Admin/Branding"));
const Branch = lazy(() => import("../components/Admin/Branch"));
const Currency = lazy(() => import("../components/Admin/Currency"));
const LoanCalculator = lazy(() => import("../components/Admin/LoanCalculator"));
const Loans = lazy(() => import("../components/Admin/Loans"));
const Savings = lazy(() => import("../components/Admin/Savings"));
// const Loan = lazy(() => import("../components/Admin/Loan"));
const EmployeeDashboard = lazy(() => import("../components/Employee"));
const CustomerDashboard = lazy(() => import("../components/Customer"));
const CustomerPro = lazy(() => import("../components/Admin/CustomerPro"));
// const CustomerDashboard = lazy(() => import("../components/Customer"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Homepage />} />

          {/* start admin related routes*/}
          <Route
            path="/admin/"
            element={<Guard endpoint={"/api/verify-token"} role="admin" />}
          >
            <Route index element={<Dashboard />} />
            <Route path="branding" element={<Branding />} />
            <Route path="branch" element={<Branch />} />
            <Route path="currency" element={<Currency />} />
            <Route path="new-employee" element={<NewEmployee />} />
            <Route path="LoanCalculator" element={<LoanCalculator />} />
            {/* <Route path="loan" element={<Loan/>} /> */}
            <Route path="loans" element={<Loans />} />
            <Route path="savings" element={<Savings />} />
            <Route path="customerpro/:id" element={<CustomerPro />} />

            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* emp related routes*/}
          <Route
            path="/employee/"
            element={<Guard endpoint={"/api/verify-token"} role="employee" />}
          >
            <Route index element={<EmployeeDashboard />} />

            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* customer related routes*/}
          <Route
            path="/customer/"
            element={<Guard endpoint="/api/verify-token" role="customer" />}
          >
            <Route index element={<CustomerDashboard />} />
            <Route path="customerpro/:id" element={<CustomerPro />} />
          </Route>

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
