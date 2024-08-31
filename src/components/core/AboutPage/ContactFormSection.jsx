import React from "react";
import ContactUsForm from "../ContactUsPage/ContactUsForm";
const ContactFormSection = () => {
  return (
    <div className="flex flex-col gap-3 text-white">
      <h1>Get in Touch</h1>

      <p>We'd love to here or you, Please fill out this form.</p>

      <div>
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactFormSection;
