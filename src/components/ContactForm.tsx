export function ContactForm() {
  return (
    <form>
      <div>
        <label htmlFor="name">name</label>
        <input type="text" name="name" id="name" />
      </div>
      <div>
        <label htmlFor="email">email</label>
        <input type="email" name="email" id="email" />
      </div>
    </form>
  );
}

export default ContactForm;
