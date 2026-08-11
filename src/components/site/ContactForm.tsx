import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { practiceAreas } from "@/data/practiceAreas";
import { site } from "@/data/site";
import { Button } from "./Button";
import { Field, SelectInput, TextArea, TextInput } from "./Field";

type Status = "idle" | "submitting" | "success";

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  practiceArea: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  practiceArea: "",
  message: "",
};

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your full name.";
  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (values.phone.trim() && !/^[+\d][\d\s()-]{6,}$/.test(values.phone.trim())) {
    errors.phone = "Please enter a valid phone number, or leave this field empty.";
  }
  if (!values.subject.trim()) errors.subject = "Please enter a subject.";
  if (!values.practiceArea) errors.practiceArea = "Please select the closest practice area.";
  if (values.message.trim().length < 20) {
    errors.message = "Please tell us a little more about your matter (at least 20 characters).";
  }
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const set =
    (key: keyof FormState) =>
    (event: { target: { value: string } }) => {
      setValues((current) => ({ ...current, [key]: event.target.value }));
      setErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setStatus("submitting");
    // Placeholder submit — there is no backend yet.
    // TODO: wire this to the firm's intake endpoint when available.
    window.setTimeout(() => setStatus("success"), 1200);
  };

  if (status === "success") {
    return (
      <div role="status" className="border border-rule bg-mist p-8 md:p-10">
        <CheckCircle2 className="size-8 text-gold-deep" aria-hidden="true" />
        <h2 className="display-3 mt-5 text-ink">Thank you{values.name ? `, ${values.name.split(" ")[0]}` : ""}.</h2>
        <p className="measure mt-4 leading-relaxed text-ink-soft">
          Your enquiry has been received. A member of our team will review it and respond within one
          business day. If your matter is urgent, please call us on {site.phone}. Please do not send
          confidential documents until we have confirmed that we can act.
        </p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => {
            setValues(initialState);
            setStatus("idle");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" htmlFor="contact-name" required error={errors.name}>
          <TextInput
            id="contact-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
        </Field>
        <Field label="Email address" htmlFor="contact-email" required error={errors.email}>
          <TextInput
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Phone (optional)" htmlFor="contact-phone" error={errors.phone}>
          <TextInput
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={set("phone")}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
          />
        </Field>
        <Field label="Practice area" htmlFor="contact-practice-area" required error={errors.practiceArea}>
          <SelectInput
            id="contact-practice-area"
            name="practiceArea"
            value={values.practiceArea}
            onChange={set("practiceArea")}
            aria-invalid={errors.practiceArea ? true : undefined}
            aria-describedby={errors.practiceArea ? "contact-practice-area-error" : undefined}
          >
            <option value="">Select a practice area</option>
            {practiceAreas.map((area) => (
              <option key={area.slug} value={area.slug}>
                {area.name}
              </option>
            ))}
            <option value="other">Other / not sure</option>
          </SelectInput>
        </Field>
      </div>

      <Field label="Subject" htmlFor="contact-subject" required error={errors.subject}>
        <TextInput
          id="contact-subject"
          name="subject"
          value={values.subject}
          onChange={set("subject")}
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
        />
      </Field>

      <Field label="Your message" htmlFor="contact-message" required error={errors.message}>
        <TextArea
          id="contact-message"
          name="message"
          value={values.message}
          onChange={set("message")}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-6">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send enquiry"}
        </Button>
        <p className="text-sm text-ink-soft">We respond within one business day.</p>
      </div>
    </form>
  );
}
