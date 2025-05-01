export default function ContactForm() {
    return (
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Your Name" className="border p-2 rounded" />
        <input type="email" placeholder="Your Email" className="border p-2 rounded" />
        <textarea placeholder="Your Message" className="border p-2 rounded"></textarea>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Send</button>
      </form>
    );
  }