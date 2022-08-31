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
      <div className="flex flex-col m-2">
        <label className="text-sm" htmlFor="name">
          name
        </label>
        <input
          className="text-green-900"
          type="text"
          name="name"
          id="name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </div>
      <div className="flex flex-col m-2">
        <label className="text-sm" htmlFor="email">
          email
        </label>
        <input
          className="text-green-900"
          type="email"
          name="email"
          id="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </div>
      <div className="flex flex-col m-2">
        <label className="text-sm" htmlFor="message">
          message
        </label>
        <textarea
          className="text-green-900"
          name="message"
          id="message"
          value={data.message}
          onChange={(e) => setData({ ...data, message: e.target.value })}
        ></textarea>
      </div>
      <div className="flex gap-4 m-2">
        <button className="px-3 py-1 bg-blue-600" type="submit">
          send message
        </button>
        <button className="px-3 py-1 bg-red-600" type="reset">
          cancel
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
