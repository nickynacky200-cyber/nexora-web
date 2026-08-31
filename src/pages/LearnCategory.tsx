import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, BookOpen, ChevronRight, Clock } from "lucide-react";
import Card from "../components/Card";
import { getBooks, Book } from "../lib/api";
import { LEARN_CATEGORIES } from "./Learn";

export default function LearnCategory() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [books, setBooks] = useState<Book[] | null>(null);

  const category = LEARN_CATEGORIES.find((c) => c.id === categoryId);

  useEffect(() => {
    getBooks()
      .then((data) => setBooks(data.books.filter((b) => b.category === categoryId)))
      .catch(() => setBooks([]));
  }, [categoryId]);

  if (!category) {
    return (
      <div className="screen">
        <p style={{ color: "var(--text-secondary)" }}>Category not found.</p>
        <button onClick={() => navigate("/learn")} style={{ background: "none", border: "none", color: "var(--primary)", padding: 0 }}>
          Back to Learn
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <button onClick={() => navigate("/learn")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}>
        <ChevronLeft size={18} /> Back to Learn
      </button>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: category.color + "22",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: category.color,
            flexShrink: 0,
          }}
        >
          <category.Icon size={20} />
        </div>
        <div style={{ marginLeft: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>{category.title}</h2>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>{category.subtitle}</p>
        </div>
      </div>

      {books === null && (
        <Card>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", margin: 0, fontSize: 13 }}>Loading…</p>
        </Card>
      )}

      {books?.length === 0 && (
        <Card style={{ textAlign: "center", padding: 32 }}>
          <Clock size={26} color="var(--text-secondary)" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>Coming Soon</p>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, margin: 0 }}>
            No books have been added to {category.title} yet.
          </p>
        </Card>
      )}

      {books?.map((book) => (
        <Card key={book.id} style={{ marginTop: 10, cursor: "pointer" }} onClick={() => navigate(`/learn/books/${book.id}`)}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BookOpen size={18} color={category.color} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{book.title}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>{book.author}</p>
            </div>
            <ChevronRight size={16} color="var(--text-secondary)" />
          </div>
        </Card>
      ))}
    </div>
  );
}
