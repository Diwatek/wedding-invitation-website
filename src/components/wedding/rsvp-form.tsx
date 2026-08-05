"use client";

import { FormEvent, useRef, useState } from "react";
import type { PublicWeddingGuest } from "@/types/guest";

export function RsvpForm({ guest }: { guest: PublicWeddingGuest }) {
  const formRef = useRef<HTMLFormElement>(null);
  const attendanceRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "Demonstration complete. This RSVP was not saved, sent, or added to a guest list.",
    );
  }

  function clearForm() {
    formRef.current?.reset();
    setMessage("");
    attendanceRef.current?.focus();
  }

  return (
    <form ref={formRef} className="rsvp-form" onSubmit={submit}>
      <fieldset>
        <legend>Attendance</legend>
        {["Joyfully accepts", "Regretfully declines", "Still deciding"].map(
          (label, index) => (
            <label key={label}>
              <input
                ref={index === 0 ? attendanceRef : undefined}
                type="radio"
                name="attendance"
                value={label}
                required
              />
              <span>{label}</span>
            </label>
          ),
        )}
      </fieldset>

      <label>
        Number attending
        <select name="number-attending" defaultValue="">
          <option value="" disabled>
            Select guests
          </option>
          {Array.from({ length: guest.reservedSeats + 1 }, (_, value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      <label>
        Guest names
        <textarea name="guest-names" rows={3} />
      </label>

      <label>
        Dietary notes
        <textarea name="dietary-notes" rows={3} maxLength={500} />
      </label>

      <label>
        Message for the couple
        <textarea name="couple-message" rows={4} maxLength={1000} />
      </label>

      <label className="checkbox-label">
        <input type="checkbox" name="demo-confirmation" required />
        <span>
          I understand this is a fictional RSVP demonstration and no response
          will be saved or sent.
        </span>
      </label>

      <div className="dialog-actions">
        <button type="submit">Preview RSVP Experience</button>
        <button type="button" onClick={clearForm}>
          Clear Form
        </button>
      </div>

      <p aria-live="polite" role="status" className="form-success">
        {message}
      </p>
    </form>
  );
}
