import { useState } from "react";
import { ContactForm as Form } from "./ContactForm";
import type { ContactForm } from "./ContactForm";

const initialData: ContactForm = {
  name: "",
  email: "",
  message: "",
};

export function Contact() {
  let [data, setData] = useState<ContactForm>(initialData);
  async function onSubmit(data: ContactForm) {
    let result = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log(result);
  }
  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Form data={data} setData={setData} onSubmit={onSubmit} />
    </>
  );
}
