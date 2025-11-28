import { Card } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../../../modules/module";

const CustomerPro = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loans, setLoans] = useState([]);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [emiInput, setEmiInput] = useState({});

  const loadProfile = async () => {
    try {
      const httpReq = http();
      const { data } = await httpReq.get(`/api/loans/customerpro/${id}`);
      setCustomer(data.customer || null);
      setLoans(data.loans || []);

      const notesRes = await httpReq.get(`/api/notes/${id}`);
      setNotes(notesRes.data.notes || []);
    } catch (err) {
      console.log("Error fetching profile", err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const calculateEMI = (loanAmount, interest, duration) => {
    const monthlyInterestRate = interest / 12 / 100;
    if (monthlyInterestRate === 0) return loanAmount / duration;

    const emi =
      (loanAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, duration)) /
      (Math.pow(1 + monthlyInterestRate, duration) - 1);

    return Math.round(emi);
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    try {
      const httpReq = http();
      await httpReq.post("/api/notes", {
        customerId: id,
        note: noteText.trim(),
      });

      const notesRes = await httpReq.get(`/api/notes/${id}`);
      setNotes(notesRes.data.notes || []);
      setNoteText("");
    } catch (err) {
      console.log("Error saving note", err);
    }
  };

  const payEMI = async (loanId) => {
    const amount = emiInput[loanId];
    if (!amount || isNaN(amount)) return alert("Enter a valid EMI amount");

    try {
      const httpReq = http();
      await httpReq.post("/api/loans/pay-emi", {
        loanId,
        amount: Number(amount),
      });

      alert("EMI Added Successfully");
      setEmiInput((prev) => ({ ...prev, [loanId]: "" }));
      loadProfile();
    } catch (err) {
      console.log("Error paying EMI:", err);
      alert("EMI Payment Error");
    }
  };

  return (
    <div className="p-6 grid place-items-center">
      <Card className="w-full max-w-2xl shadow-md rounded-2xl p-6">
        <h2 className="text-3xl font-bold mb-4 text-center">Customer Profile</h2>

        {!customer ? (
          <p className="text-center text-red-500 font-semibold">No Profile Available</p>
        ) : (
          <div className="space-y-4 text-base">
            <h3 className="text-xl font-semibold mb-2">Customer Details</h3>
            <div><strong>Name:</strong> {customer.fullname}</div>
            <div><strong>Email:</strong> {customer.email}</div>
            <div><strong>Mobile:</strong> {customer.mobile || "N/A"}</div>
            <div><strong>Address:</strong> {customer.address || "N/A"}</div>

            <hr />

            <h3 className="text-xl font-semibold mb-2">Loan Details</h3>

            {loans.length === 0 ? (
              <p className="text-red-500 font-semibold">No Loan Data Available</p>
            ) : (
              loans.map((loan, index) => {
                const totalPaid = loan.emiHistory.reduce(
                  (sum, e) => sum + e.amount,
                  0
                );

                const remainingLoan = loan.totalLoan - totalPaid;

                return (
                  <div key={loan._id} className="border p-4 rounded-lg mb-4 bg-gray-50">
                    <h4 className="font-semibold text-lg mb-2">Loan #{index + 1}</h4>
                    <div><strong>Loan Type:</strong> {loan.loanType}</div>
                    <div><strong>Loan Amount:</strong> ₹ {loan.loanAmount}</div>
                    <div><strong>Interest:</strong> {loan.interest}%</div>
                    <div><strong>Duration:</strong> {loan.duration} months</div>
                    <div><strong>Total Loan:</strong> ₹ {loan.totalLoan}</div>
                    <div>
                      <strong>Monthly EMI:</strong>{" "}
                      <span className="text-blue-600 font-semibold">
                        ₹ {calculateEMI(loan.loanAmount, loan.interest, loan.duration)}
                      </span>
                    </div>
                    <div>
                      <strong>Total Paid:</strong>{" "}
                      <span className="text-green-600 font-semibold">₹ {totalPaid}</span>
                    </div>
                    <div>
                      <strong>Remaining Loan:</strong>{" "}
                      <span className="text-red-600 font-semibold">₹ {remainingLoan}</span>
                    </div>

                    {/* PAY EMI */}
                    <div className="mt-5 p-4 bg-blue-50 rounded-xl">
                      <h3 className="font-bold text-lg mb-2">Pay EMI</h3>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          value={emiInput[loan._id] || ""}
                          onChange={(e) =>
                            setEmiInput({ ...emiInput, [loan._id]: e.target.value })
                          }
                          placeholder="Enter EMI Amount"
                          className="flex-1 border p-3 rounded-lg"
                        />
                        <button
                          onClick={() => payEMI(loan._id)}
                          className="px-4 py-2 rounded-lg text-white bg-blue-600"
                        >
                          Pay
                        </button>
                      </div>
                    </div>

                    {/* PAYMENT HISTORY (NO STATUS) */}
                    {loan.emiHistory.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                        <h4 className="font-semibold mb-2">Payment History</h4>
                        <ul className="list-disc list-inside max-h-40 overflow-y-auto">
                          {loan.emiHistory.map((emi, i) => (
                            <li key={i} className="mb-2">
                              ₹ {emi.amount} paid on{" "}
                              {new Date(emi.paidAt).toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </Card>

      {/* NOTES */}
      <div className="w-full max-w-2xl mt-6">
        <Card className="shadow-md rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-4 text-center">Customer Notes</h3>
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write something..."
              className="flex-1 border p-3 rounded-lg"
            />
            <button onClick={addNote} className="bg-blue-600 text-white px-5 rounded-lg">
              Add
            </button>
          </div>

          {notes.length === 0 ? (
            <p className="text-gray-500 text-center">No notes added yet.</p>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {notes.map((n) => (
                <div key={n._id} className="p-4 bg-gray-100 border rounded-xl flex justify-between">
                  <div>
                    <div className="text-xs text-gray-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                    <div className="font-medium">{n.note}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <button
        onClick={() => navigate("/admin/loans")}
        className="mt-6 bg-gray-200 px-4 py-2 rounded-lg"
      >
        ← Back
      </button>
    </div>
  );
};

export default CustomerPro;
