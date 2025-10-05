"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        let detail = "Failed to send.";
        try {
          const j = await res.json();
          if (j?.errors && typeof j.errors === "object") {
            detail = Object.values(j.errors).join(" ");
          }
        } catch {}
        setStatus("error");
        setErrorMsg(detail);
        return;
      }

      setStatus("ok");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error.");
    }
  }

  return (
    <main className="p-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">Contact</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="w-full p-3 rounded bg-white/10"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full p-3 rounded bg-white/10"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="w-full p-3 rounded bg-white/10"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <textarea
          className="w-full p-3 rounded bg-white/10 h-40"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={3}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="px-4 py-2 rounded bg-blue-600 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>

        {status === "ok" && (
          <p className="text-green-500 mt-2">Thanks! Message sent.</p>
        )}
        {status === "error" && (
          <p className="text-red-500 mt-2">
            {errorMsg ?? "Oops, failed to send."}
          </p>
        )}
      </form>
    </main>
  );
}
