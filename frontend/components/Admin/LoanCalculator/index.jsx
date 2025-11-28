import React, { useState } from "react";
import Adminlayout from "../../Layout/Adminlayout";

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [time, setTime] = useState("");
  const [emi, setEmi] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);

  const calculateLoan = (e) => {
    e.preventDefault();

    const p = parseFloat(principal);
    const r = parseFloat(interestRate);
    const n = parseFloat(time);

    if (p > 0 && r > 0 && n > 0) {
      const monthlyRate = r / 12 / 100;
      const calcEmi =
        p *
        monthlyRate *
        (Math.pow(1 + monthlyRate, n) /
          (Math.pow(1 + monthlyRate, n) - 1));

      const totalPay = calcEmi * n;
      const totalInt = totalPay - p;

      setEmi(calcEmi.toFixed(2));
      setTotalInterest(totalInt.toFixed(2));
      setTotalAmount(totalPay.toFixed(2));
    } else {
      alert("Please enter valid numbers for all fields!");
    }
  };

  const resetAll = () => {
    setPrincipal("");
    setInterestRate("");
    setTime("");
    setEmi(null);
    setTotalInterest(null);
    setTotalAmount(null);
  };

  const containerStyle = {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #a8edea, #fed6e3)",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#333",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #aaa",
    fontSize: "16px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  };

  const calcButton = {
    ...buttonStyle,
    backgroundColor: "#4CAF50",
    marginRight: "10px",
  };

  const resetButton = {
    ...buttonStyle,
    backgroundColor: "#f44336",
  };

  const resultBox = {
    marginTop: "25px",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#ffffffb8",
    textAlign: "center",
  };

  const resultTitle = {
    color: "#222",
    fontWeight: "bold",
  };

  const resultValue = {
    fontSize: "20px",
    color: "#0d6efd",
  };

  return (
        <Adminlayout>
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", color: "#222" }}>💰 Loan Calculator</h2>
      <form onSubmit={calculateLoan}>
        <label style={labelStyle}>Loan Amount (₹):</label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          style={inputStyle}
          placeholder="Enter loan amount"
          required
        />
        <br /><br />

        <label style={labelStyle}>Interest Rate (% per year):</label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          style={inputStyle}
          placeholder="Enter annual interest rate"
          required
        />
        <br /><br />

        <label style={labelStyle}>Loan Period (months):</label>
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={inputStyle}
          placeholder="Enter loan period in months"
          required
        />
        <br /><br />

        <div style={{ textAlign: "center" }}>
          <button type="submit" style={calcButton}>
            Calculate
          </button>
          <button type="button" onClick={resetAll} style={resetButton}>
            Reset
          </button>
        </div>
      </form>

      {emi && (
        <div style={resultBox}>
          <h3 style={resultTitle}>Result Summary</h3>
          <p><b>Monthly EMI:</b> <span style={resultValue}>₹ {emi}</span></p>
          <p><b>Total Interest:</b> <span style={resultValue}>₹ {totalInterest}</span></p>
          <p><b>Total Payment (Principal + Interest):</b> <span style={resultValue}>₹ {totalAmount}</span></p>
        </div>
      )}
    </div>
        </Adminlayout>
  );
};

export default LoanCalculator;
