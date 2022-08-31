import type { SyntheticEvent } from "react";

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  data: ContactForm;
  setData(c: ContactForm): void;
  onSubmit(c: ContactForm): void;
}

export function ContactForm({ data, setData, onSubmit }: ContactFormProps) {
  function _onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(data);
  }

  return (
    <form onSubmit={_onSubmit}>
      <div>
        <label htmlFor="name">name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="email">email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="message">message</label>
        <textarea
          name="message"
          id="message"
          value={data.message}
          onChange={(e) => setData({ ...data, message: e.target.value })}
        ></textarea>
        <button type="submit">send message</button>
        <button type="reset">cancle</button>
      </div>
    </form>
  );
}

export default ContactForm;
