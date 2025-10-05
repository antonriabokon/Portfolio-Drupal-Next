import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/contact",
    expects: "POST",
  });
}

export async function POST(req: Request) {
  let name = "",
    email = "",
    subject = "",
    message = "";
  const ct = req.headers.get("content-type") ?? "";
  try {
    if (ct.includes("application/json")) {
      const data = await req.json();
      name = (data?.name ?? "").trim();
      email = (data?.email ?? "").trim();
      subject = (data?.subject ?? "").trim();
      message = (data?.message ?? "").trim();
    } else if (ct.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      const p = new URLSearchParams(text);
      name = (p.get("name") ?? "").trim();
      email = (p.get("email") ?? "").trim();
      subject = (p.get("subject") ?? "").trim();
      message = (p.get("message") ?? "").trim();
    } else {
      const form = await req.formData();
      name = String(form.get("name") ?? "").trim();
      email = String(form.get("email") ?? "").trim();
      subject = String(form.get("subject") ?? "").trim();
      message = String(form.get("message") ?? "").trim();
    }
  } catch {}

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required.";
  if (!email) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email.";
  if (!subject) errors.subject = "Subject is required.";
  if (!message) errors.message = "Message is required.";
  else if (message.length < 3)
    errors.message = "Message must be at least 3 characters.";

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  console.log("[contact]", { name, email, subject, message });

  return NextResponse.json(
    { ok: true, message: "Message accepted." },
    { status: 200 }
  );
}
