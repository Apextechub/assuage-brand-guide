import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, Paperclip } from "lucide-react";
import { openRoles } from "@/data/careers";
import { site } from "@/data/site";
import { Button } from "./Button";
import { Field, SelectInput, TextArea, TextInput } from "./Field";

type Status = "idle" | "submitting" | "success";

interface FormState {
  name: string;
  email: string;
  phone: string;
  role: string;
  coverNote: string;
}

type FormErrors = Partial<Record<keyof FormState | "cv", string>>;

const initialState: FormState = { name: "", email: "", phone: "", role: "", coverNote: "" };

const MAX_CV_BYTES = 5 * 1024 * 1024;
const CV_EXTENSIONS = [".pdf", ".doc", ".docx"];

export function CareersForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [cv, setCv] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const set =
    (key: keyof FormState) =>
    (event: { target: { value: string } }) => {
      setValues((current) => ({ ...current, [key]: event.target.value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
    };

  const onCvChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setCv(file);
    setErrors((current) => ({ ...current, cv: undefined }));
    if (!file) return;
    const lower = file.name.toLowerCase();
    if (!CV_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
      setErrors((current) => ({ ...current, cv: "Please attach a PDF or Word document." }));
      setCv(null);
    } else if (file.size > MAX_CV_BYTES) {
      setErrors((current) => ({ ...current, cv: "Your CV must be 5MB or smaller." }));
      setCv(null);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    if (!values.name.trim()) nextErrors.name = "Please enter your full name.";
    if (!values.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (values.phone.trim() && !/^[+\d][\d\s()-]{6,}$/.test(values.phone.trim())) {
      nextErrors.phone = "Please enter a valid phone number, or leave this field empty.";
    }
    if (!values.role) nextErrors.role = "Please select the role you are applying for.";
    if (!cv) nextErrors.cv = "Please attach your CV.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setStatus("submitting");
    // Placeholder submit — there is no backend yet.
    // TODO: wire this to the firm's recruitment mailbox / ATS when available.
    window.setTimeout(() => setStatus("success"), 1200);
  };

  if (status === "success") {
    return (
      <div role="status" className="border border-rule bg-paper p-8 md:p-10">
        <CheckCircle2 className="size-8 text-gold-deep" aria-hidden="true" />
        <h2 className="display-3 mt-5 text-ink">Application received.</h2>
        <p className="measure mt-4 leading-relaxed text-ink-soft">
          Thank you for your interest in {site.name}. We review every application and will contact
          you if your experience fits a current or upcoming role. We keep applications on file for
          twelve months.
        </p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => {
            setValues(initialState);
            setCv(null);
            setStatus("idle");
          }}
        >
          Submit another application
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" htmlFor="apply-name" required error={errors.name}>
          <TextInput
            id="apply-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "apply-name-error" : undefined}
          />
        </Field>
        <Field label="Email address" htmlFor="apply-email" required error={errors.email}>
          <TextInput
            id="apply-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "apply-email-error" : undefined}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Phone (optional)" htmlFor="apply-phone" error={errors.phone}>
          <TextInput
            id="apply-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={set("phone")}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "apply-phone-error" : undefined}
          />
        </Field>
        <Field label="Role" htmlFor="apply-role" required error={errors.role}>
          <SelectInput
            id="apply-role"
            name="role"
            value={values.role}
            onChange={set("role")}
            aria-invalid={errors.role ? true : undefined}
            aria-describedby={errors.role ? "apply-role-error" : undefined}
          >
            <option value="">Select a role</option>
            {openRoles.map((role) => (
              <option key={role.slug} value={role.slug}>
                {role.title}
              </option>
            ))}
            <option value="speculative">Speculative application</option>
          </SelectInput>
        </Field>
      </div>

      <Field label="Cover note (optional)" htmlFor="apply-cover-note">
        <TextArea
          id="apply-cover-note"
          name="coverNote"
          rows={5}
          value={values.coverNote}
          onChange={set("coverNote")}
        />
      </Field>

      <Field label="Curriculum vitae" htmlFor="apply-cv" required error={errors.cv}>
        <input
          id="apply-cv"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={onCvChange}
          className="sr-only"
          aria-invalid={errors.cv ? true : undefined}
          aria-describedby={`apply-cv-hint${errors.cv ? " apply-cv-error" : ""}`}
        />
        <label
          htmlFor="apply-cv"
          className="flex cursor-pointer items-center justify-between gap-4 border border-dashed border-rule bg-paper px-4 py-4 text-sm transition-colors duration-200 hover:border-ink-soft/40"
        >
          <span className="flex items-center gap-3 text-ink-soft">
            <Paperclip className="size-4" aria-hidden="true" />
            {cv ? cv.name : "Attach your CV"}
          </span>
          <span className="micro-label shrink-0 text-gold-deep">Choose file</span>
        </label>
        <p id="apply-cv-hint" className="mt-2 text-xs text-ink-soft">
          PDF or Word document, no larger than 5MB.
        </p>
      </Field>

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
