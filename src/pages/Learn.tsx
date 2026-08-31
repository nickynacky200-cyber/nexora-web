import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Lightbulb, User, Wallet, ChevronRight } from "lucide-react";
import Card from "../components/Card";
import { getBooks, Book } from "../lib/api";

export const LEARN_CATEGORIES = [
  { id: "entrepreneurship", title: "Entrepreneurship Studies", subtitle: "Build and grow successful ventures.", Icon: Briefcase, color: "var(--blue)" },
  { id: "innovation", title: "Innovation Studies", subtitle: "Learn how to think creatively and solve real problems.", Icon: Lightbulb, color: "var(--gold)" },
  { id: "personal-dev", title: "Personal Development", subtitle: "Build the mindset and habits of high achievers.", Icon: User, color: "var(--green)" },
  { id: "financial-literacy", title: "Financial Literacy", subtitle: "Master money, budgeting, investing and more.", Icon: Wallet, color: "var(--blue)" },
];

export default function Learn() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[] | null>(null);

  useEffect(() => {
    getBooks()
      .then((data) => setBooks(data.books))
      .catch(() => setBooks([]));
  }, []);

  return (
    <div className="screen">
      <h2 style={{ marginTop: 24, marginBottom: 4 }}>Learn</h2>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>Choose what you want to study</p>

      {LEARN_CATEGORIES.map((cat) => {
        const count = books?.filter((b) => b.category === cat.id).length ?? null;
        return (
          <Card
            key={cat.id}
            style={{ marginTop: 14, cursor: "pointer" }}
            onClick={() => navigate(`/learn/${cat.id}`)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: cat.color + "22",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: cat.color,
                  flexShrink: 0,
                }}
              >
                <cat.Icon size={20} />
              </div>
              <div style={{ marginLeft: 12, flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{cat.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>{cat.subtitle}</p>
                <p style={{ margin: "4px 0 0", fontSize: 11, color: cat.color, fontWeight: 600 }}>
                  {count === null ? " " : count > 0 ? `${count} book${count > 1 ? "s" : ""}` : "Coming soon"}
                </p>
              </div>
              <ChevronRight size={18} color="var(--text-secondary)" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
