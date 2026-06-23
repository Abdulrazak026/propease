"use client";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfFlipbookProps {
  url: string;
}

export default function PdfFlipbook({ url }: PdfFlipbookProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Pre-check if URL is accessible
    if (!url) {
      setError(true);
      setLoading(false);
    }
  }, [url]);

  const onDocumentLoadSuccess = ({ numPages: total }: { numPages: number }) => {
    setNumPages(total);
    setLoading(false);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error("PDF load error:", err);
    setError(true);
    setLoading(false);
  };

  const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNext = () => setCurrentPage((p) => Math.min(numPages, p + 1));

  if (error || !url) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
        <p className="text-gray-500 text-sm">PDF preview is not available.</p>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-brand-blue text-sm font-medium hover:underline mt-2 inline-block">
            Download PDF instead
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-900">Investment Proposal</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-blue font-medium hover:underline">
          Download PDF
        </a>
      </div>

      {/* PDF Viewer */}
      <div className="relative flex items-center justify-center min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] bg-white">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-gray-400">Loading PDF...</p>
          </div>
        )}

        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading=""
        >
          <Page
            pageNumber={currentPage}
            width={800}
            className="max-w-full"
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>

        {/* Navigation Arrows */}
        {numPages > 1 && (
          <>
            <button
              onClick={goToPrev}
              disabled={currentPage === 1}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              disabled={currentPage === numPages}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Footer: Page indicator + dots */}
      {numPages > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-xs text-gray-500">Page {currentPage} of {numPages}</span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: numPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-2 h-2 rounded-full transition-all ${currentPage === i + 1 ? "bg-brand-blue w-4" : "bg-gray-300 hover:bg-gray-400"}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
