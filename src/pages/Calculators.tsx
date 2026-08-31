import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Trash2, Calculator, TrendingUp } from "lucide-react";
import Card from "../components/Card";

function formatNaira(n: number) {
  const sign = n < 0 ? "-" : "";
  return sign + "₦" + Math.abs(Math.round(n)).toLocaleString();
}

type LineItem = { id: string; label: string; amount: string };

function newItem(): LineItem {
  return { id: Math.random().toString(36).slice(2), label: "", amount: "" };
}

const rowInputStyle: React.CSSProperties = {
  flex: 1,
  padding: 10,
  borderRadius: 8,
  border: "1px solid var(--border)",
  fontSize: 13,
  background: "var(--surface)",
  color: "var(--text-primary)",
};

function BudgetCalculator() {
  const [income, setIncome] = useState<LineItem[]>([{ ...newItem(), label: "Salary / main income" }]);
  const [expenses, setExpenses] = useState<LineItem[]>([{ ...newItem(), label: "Rent" }]);

  const sum = (items: LineItem[]) => items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const totalIncome = sum(income);
  const totalExpenses = sum(expenses);
  const net = totalIncome - totalExpenses;

  const updateRow = (list: LineItem[], setList: (l: LineItem[]) => void, id: string, field: "label" | "amount", value: string) => {
    setList(list.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const renderList = (title: string, list: LineItem[], setList: (l: LineItem[]) => void) => (
    <>
      <p style={{ fontWeight: 700, fontSize: 14, marginTop: 18, marginBottom: 8 }}>{title}</p>
      {list.map((item) => (
        <div key={item.id} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
          <input
            value={item.label}
            onChange={(e) => updateRow(list, setList, item.id, "label", e.target.value)}
            placeholder="Label"
            style={{ ...rowInputStyle, flex: 1.4 }}
          />
          <input
            value={item.amount}
            onChange={(e) => updateRow(list, setList, item.id, "amount", e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="₦0"
            inputMode="decimal"
            style={rowInputStyle}
          />
          <button
            onClick={() => setList(list.filter((i) => i.id !== item.id))}
            style={{ background: "none", border: "none", padding: 4 }}
          >
            <Trash2 size={16} color="var(--red)" />
          </button>
        </div>
      ))}
      <button
        onClick={() => setList([...list, newItem()])}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, color: "var(--primary)", fontWeight: 600, fontSize: 13 }}
      >
        <Plus size={14} /> Add {title === "Income" ? "income" : "expense"}
      </button>
    </>
  );

  return (
    <>
      <Card>
        {renderList("Income", income, setIncome)}
        {renderList("Expenses", expenses, setExpenses)}
      </Card>

      <Card style={{ marginTop: 16, background: "var(--dark-gradient)", border: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "var(--text-muted-on-dark)", fontSize: 13 }}>Total Income</span>
          <span style={{ color: "#fff", fontWeight: 700 }}>{formatNaira(totalIncome)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ color: "var(--text-muted-on-dark)", fontSize: 13 }}>Total Expenses</span>
          <span style={{ color: "#fff", fontWeight: 700 }}>{formatNaira(totalExpenses)}</span>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-muted-on-dark)", fontSize: 13, fontWeight: 700 }}>Net</span>
          <span style={{ color: net >= 0 ? "var(--green)" : "var(--red)", fontWeight: 800, fontSize: 16 }}>
            {formatNaira(net)}
          </span>
        </div>
      </Card>
    </>
  );
}

function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState("");
  const [price, setPrice] = useState("");
  const [variableCost, setVariableCost] = useState("");

  const fc = parseFloat(fixedCosts) || 0;
  const p = parseFloat(price) || 0;
  const vc = parseFloat(variableCost) || 0;
  const contributionMargin = p - vc;
  const canCompute = fc > 0 && contributionMargin > 0;
  const breakEvenUnits = canCompute ? Math.ceil(fc / contributionMargin) : null;
  const breakEvenRevenue = breakEvenUnits !== null ? breakEvenUnits * p : null;

  return (
    <>
      <Card>
        <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Fixed Costs</p>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 0, marginBottom: 8 }}>
          Costs that don't change with sales volume — rent, salaries, etc.
        </p>
        <input
          value={fixedCosts}
          onChange={(e) => setFixedCosts(e.target.value.replace(/[^0-9.]/g, ""))}
          placeholder="₦0"
          inputMode="decimal"
          style={{ ...rowInputStyle, width: "100%", marginBottom: 16 }}
        />

        <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Price per Unit</p>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
          placeholder="₦0"
          inputMode="decimal"
          style={{ ...rowInputStyle, width: "100%", marginBottom: 16 }}
        />

        <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Variable Cost per Unit</p>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 0, marginBottom: 8 }}>
          Cost that scales with each unit sold — materials, packaging, etc.
        </p>
        <input
          value={variableCost}
          onChange={(e) => setVariableCost(e.target.value.replace(/[^0-9.]/g, ""))}
          placeholder="₦0"
          inputMode="decimal"
          style={{ ...rowInputStyle, width: "100%" }}
        />
      </Card>

      <Card style={{ marginTop: 16, background: "var(--dark-gradient)", border: "none" }}>
        {p > 0 && vc > 0 && contributionMargin <= 0 ? (
          <p style={{ color: "var(--red)", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            Your price (₦{p.toLocaleString()}) doesn't cover your variable cost (₦{vc.toLocaleString()}) — at this
            pricing, more sales only means more losses. Raise the price or lower the variable cost.
          </p>
        ) : breakEvenUnits === null ? (
          <p style={{ color: "var(--text-muted-on-dark)", fontSize: 13, margin: 0 }}>
            Fill in all three fields to see your break-even point.
          </p>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "var(--text-muted-on-dark)", fontSize: 13 }}>Contribution Margin / Unit</span>
              <span style={{ color: "#fff", fontWeight: 700 }}>{formatNaira(contributionMargin)}</span>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 12 }}>
              <p style={{ color: "var(--text-muted-on-dark)", fontSize: 12, margin: 0 }}>You need to sell</p>
              <p style={{ color: "var(--gold)", fontWeight: 800, fontSize: 22, margin: "4px 0" }}>
                {breakEvenUnits.toLocaleString()} units
              </p>
              <p style={{ color: "var(--text-muted-on-dark)", fontSize: 12, margin: 0 }}>
                (₦{breakEvenRevenue!.toLocaleString()} in revenue) before you start making a profit.
              </p>
            </div>
          </>
        )}
      </Card>
    </>
  );
}

export default function Calculators() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"budget" | "breakeven">("budget");

  return (
    <div className="screen">
      <button onClick={() => navigate("/test")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}>
        <ChevronLeft size={18} /> Back to Test
      </button>

      <h2 style={{ marginTop: 0, marginBottom: 4 }}>Business Calculators</h2>
      <p style={{ color: "var(--text-secondary)", marginTop: 0, marginBottom: 16 }}>Real tools, straight from the guide.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setTab("budget")}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            border: "none",
            background: tab === "budget" ? "var(--primary-gradient)" : "var(--surface-muted)",
            color: tab === "budget" ? "#fff" : "var(--text-secondary)",
            fontWeight: 700,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Calculator size={15} /> Budget
        </button>
        <button
          onClick={() => setTab("breakeven")}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            border: "none",
            background: tab === "breakeven" ? "var(--primary-gradient)" : "var(--surface-muted)",
            color: tab === "breakeven" ? "#fff" : "var(--text-secondary)",
            fontWeight: 700,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <TrendingUp size={15} /> Break-Even
        </button>
      </div>

      {tab === "budget" ? <BudgetCalculator /> : <BreakEvenCalculator />}
    </div>
  );
}
