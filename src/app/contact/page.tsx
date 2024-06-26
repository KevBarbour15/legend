export default function Contact() {
  return (
    <div>
      <h2>Let's Work Together</h2>
      <div>
        <form className="flex flex-col items-center">
          <div>
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
          </div>
          <input type="email" placeholder="Email" required />
          <input type="tel" placeholder="Phone" required />
          <label>Preferred Date:</label>
          <input type="date" required />
          <input type="text" placeholder="Budget" required />
          <textarea placeholder="Message" required />
          <button type="submit">SUBMIT</button>
        </form>
      </div>
    </div>
  );
}
