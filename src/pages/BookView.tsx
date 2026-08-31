import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { ChevronLeft, ChevronLeft as PrevIcon, ChevronRight } from "lucide-react";
import { getBooks, saveBookProgress, Book } from "../lib/api";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export default function BookView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);

  const [book, setBook] = useState<Book | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(true);
  const [renderingPage, setRenderingPage] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load book metadata (including any saved progress) and the PDF itself.
  useEffect(() => {
    let cancelled = false;

    getBooks()
      .then(async (data) => {
        const found = data.books.find((b) => b.id === id);
        if (!found) {
          if (!cancelled) setNotFound(true);
          return;
        }
        if (cancelled) return;
        setBook(found);

        const loadingTask = pdfjsLib.getDocument(found.fileUrl);
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        const resumePage = found.lastPage && found.lastPage <= pdf.numPages ? found.lastPage : 1;
        setPageNum(resumePage);
        setLoadingDoc(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Couldn't load this book.");
          setLoadingDoc(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Render whichever page is current whenever it changes.
  useEffect(() => {
    if (!pdfDocRef.current || !canvasRef.current || loadingDoc) return;

    let cancelled = false;
    setRenderingPage(true);

    (async () => {
      try {
        const page = await pdfDocRef.current.getPage(pageNum);
        if (cancelled) return;

        const containerWidth = containerRef.current?.clientWidth || 340;
        const baseViewport = page.getViewport({ scale: 1 });
        const cssScale = containerWidth / baseViewport.width;

        // Render at full device pixel density (retina/high-DPI phones are
        // typically 2-3x), then size the canvas back down via CSS so it
        // displays at the right size but with sharp, non-blurry text.
        const outputScale = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: cssScale * outputScale });

        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = Math.floor(containerWidth) + "px";
        canvas.style.height = Math.floor(viewport.height / outputScale) + "px";

        await page.render({ canvasContext: context, viewport }).promise;
        if (cancelled) return;

        if (id) {
          saveBookProgress(id, pageNum, totalPages).catch(() => {
            // Progress saving failing silently is fine — reading still works.
          });
        }
      } catch {
        if (!cancelled) setError("Couldn't render this page.");
      } finally {
        if (!cancelled) setRenderingPage(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, loadingDoc]);

  const goPrev = () => setPageNum((p) => Math.max(1, p - 1));
  const goNext = () => setPageNum((p) => Math.min(totalPages, p + 1));

  if (notFound) {
    return (
      <div className="screen">
        <p style={{ color: "var(--text-secondary)" }}>This book couldn't be found.</p>
        <button onClick={() => navigate("/learn")} style={{ background: "none", border: "none", color: "var(--primary)", padding: 0 }}>
          Back to Learn
        </button>
      </div>
    );
  }

  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "0 16px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 8 }}>
        <button onClick={() => navigate(book ? `/learn/${book.category}` : "/learn")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)" }}>
          <ChevronLeft size={18} /> Back
        </button>
        {totalPages > 0 && (
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Page {pageNum} of {totalPages}
          </span>
        )}
      </div>

      {book && (
        <>
          <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 15 }}>{book.title}</p>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--text-secondary)" }}>{book.author}</p>
        </>
      )}

      <div
        ref={containerRef}
        style={{
          flex: 1,
          minHeight: 300,
          borderRadius: 12,
          border: "1px solid var(--border)",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          background: "#fff",
          position: "relative",
        }}
      >
        {(loadingDoc || renderingPage) && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{loadingDoc ? "Loading book…" : "Loading page…"}</p>
          </div>
        )}
        {error && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <p style={{ color: "var(--red)", fontSize: 13, textAlign: "center" }}>{error}</p>
          </div>
        )}
        <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto", display: loadingDoc ? "none" : "block" }} />
      </div>

      {totalPages > 0 && (
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button
            onClick={goPrev}
            disabled={pageNum <= 1 || renderingPage}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: 12,
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: pageNum <= 1 ? "var(--surface-muted)" : "var(--surface)",
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            <PrevIcon size={16} /> Prev
          </button>
          <button
            onClick={goNext}
            disabled={pageNum >= totalPages || renderingPage}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: 12,
              borderRadius: 10,
              border: "none",
              background: pageNum >= totalPages ? "var(--surface-muted)" : "var(--primary-gradient)",
              color: pageNum >= totalPages ? "var(--text-secondary)" : "#fff",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
