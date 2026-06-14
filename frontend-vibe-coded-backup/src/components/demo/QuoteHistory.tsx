"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2, CheckCircle2, XCircle, Mail, X } from "lucide-react";
import { QuoteHistoryItem } from "./types";

interface QuoteHistoryProps {
  history: QuoteHistoryItem[];
  onLoad: (item: QuoteHistoryItem) => void;
  onDelete: (id: string) => void;
  onToggleFollowUp: (id: string) => void;
  onMarkWon: (id: string) => void;
  onMarkLost: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function QuoteHistory({
  history,
  onLoad,
  onDelete,
  onToggleFollowUp,
  onMarkWon,
  onMarkLost,
  isOpen,
  onToggle,
}: QuoteHistoryProps) {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed left-4 bottom-4 z-40 h-12 px-4 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 border-2 transition-colors"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
          borderRadius: "0px",
        }}
      >
        <Clock className="w-4 h-4" />
        History ({history.length})
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 z-40"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto border-r-2"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
              }}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3
                    className="font-serif text-xl"
                    style={{ color: "var(--foreground)" }}
                  >
                    Quote History
                  </h3>
                  <button
                    onClick={onToggle}
                    className="h-10 w-10 flex items-center justify-center border transition-colors"
                    style={{ borderColor: "var(--border)", borderRadius: "0px" }}
                  >
                    <X className="w-4 h-4" style={{ color: "var(--foreground)" }} />
                  </button>
                </div>

                {history.length === 0 ? (
                  <p
                    className="text-sm font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No quotes yet. Generate your first one above.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        className="p-4 border-2 space-y-3"
                        style={{
                          backgroundColor: "var(--surface)",
                          borderColor: "var(--border)",
                          borderRadius: "0px",
                          opacity: item.won ? 0.6 : 1,
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p
                              className="font-mono text-xs uppercase tracking-wider"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {item.quote_number}
                            </p>
                            <p
                              className="font-serif text-lg"
                              style={{ color: "var(--foreground)" }}
                            >
                              {item.client_name}
                            </p>
                            <p
                              className="text-xs font-mono"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {item.date} · ${item.total} AUD
                            </p>
                          </div>
                          <button
                            onClick={() => onDelete(item.id)}
                            className="h-8 w-8 flex items-center justify-center border transition-colors"
                            style={{
                              borderColor: "var(--danger)",
                              color: "var(--danger)",
                              borderRadius: "0px",
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => onLoad(item)}
                            className="h-8 px-3 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                            style={{
                              backgroundColor: "var(--primary)",
                              color: "white",
                              borderRadius: "0px",
                            }}
                          >
                            Load
                          </button>
                          <button
                            onClick={() => onToggleFollowUp(item.id)}
                            className="h-8 px-3 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-1 border transition-colors"
                            style={{
                              borderColor: item.follow_up
                                ? "var(--accent)"
                                : "var(--border)",
                              color: item.follow_up
                                ? "var(--accent)"
                                : "var(--foreground)",
                              borderRadius: "0px",
                            }}
                          >
                            <Mail className="w-3 h-3" />
                            {item.follow_up ? "Follow-up Set" : "Follow Up"}
                          </button>
                          <button
                            onClick={() => onMarkWon(item.id)}
                            className="h-8 px-3 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-1 border transition-colors"
                            style={{
                              borderColor: item.won
                                ? "var(--primary)"
                                : "var(--border)",
                              color: item.won
                                ? "var(--primary)"
                                : "var(--foreground)",
                              borderRadius: "0px",
                            }}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Won
                          </button>
                          <button
                            onClick={() => onMarkLost(item.id)}
                            className="h-8 px-3 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-1 border transition-colors"
                            style={{
                              borderColor: item.lost
                                ? "var(--danger)"
                                : "var(--border)",
                              color: item.lost
                                ? "var(--danger)"
                                : "var(--foreground)",
                              borderRadius: "0px",
                            }}
                          >
                            <XCircle className="w-3 h-3" />
                            Lost
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
