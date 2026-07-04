import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { saveInquiry } from "../../services/inquiryService";
import { fetchContactSettings } from "../../services/contactService";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Design Consultation Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    async function loadInfo() {
      const data = await fetchContactSettings();
      setContactInfo(data);
    }
    loadInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitting(true);
      try {
        await saveInquiry({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "",
          subject: formData.subject || "Design Consultation Inquiry",
          message: formData.message,
        });
        setSubmitted(true);
        setFormData({ 
          name: "", 
          email: "", 
          phone: "", 
          subject: "Design Consultation Inquiry", 
          message: "" 
        });
        setTimeout(() => setSubmitted(false), 5000);
      } catch (err) {
        console.error("Inquiry submission failed:", err);
        alert("Failed to submit inquiry. Please check your network connection.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative">
      {/* Intro Page Title Banner */}
      <section className="bg-stone-950 pt-36 pb-24 md:pt-44 md:pb-32 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')` }}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="text-xs uppercase tracking-[0.3em] text-studio-accent block mb-3">Get In Touch</span>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-wide uppercase">Contact Studio</h1>
          <div className="w-16 h-[1px] bg-studio-accent mx-auto mt-6"></div>
        </div>
      </section>

      {/* Main Details and Form Split Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Form */}
          <div className="lg:col-span-7" data-aos="fade-right">
            <span className="text-xs uppercase tracking-[0.3em] text-stone-400 block mb-4">Inquiry Form</span>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 font-light mb-8">
              Begin Your Commission
            </h2>
            <p className="text-stone-500 font-light text-sm leading-relaxed mb-10">
              Please share details regarding your location, scale of the project, and design ambitions. Our design team will respond within two business days.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border-b border-stone-200 focus:border-studio-accent py-3 text-sm focus:outline-none transition-colors font-light"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-b border-stone-200 focus:border-studio-accent py-3 text-sm focus:outline-none transition-colors font-light"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border-b border-stone-200 focus:border-studio-accent py-3 text-sm focus:outline-none transition-colors font-light"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="border-b border-stone-200 focus:border-studio-accent py-3 text-sm focus:outline-none transition-colors font-light"
                    placeholder="e.g. Residential Redesign"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Project Brief *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="border-b border-stone-200 focus:border-studio-accent py-3 text-sm focus:outline-none transition-colors font-light resize-none"
                  placeholder="Describe your design needs, location, and timeline"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex items-center gap-2 bg-stone-950 text-white font-sans text-xs tracking-widest uppercase px-8 py-3.5 hover:bg-studio-accent hover:text-stone-900 transition-luxury duration-300 shadow-md font-semibold disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Inquiry"}
                <Send size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              {submitted && (
                <div className="p-4 bg-stone-100 border border-studio-accent text-stone-900 text-xs tracking-wider uppercase animate-fade-in">
                  Thank you. Your message has been sent successfully.
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Contact info and map */}
          <div className="lg:col-span-5 flex flex-col space-y-10" data-aos="fade-left">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-stone-400 block mb-4">Studio Details</span>
              <h2 className="text-3xl font-serif text-stone-900 font-light mb-8">Get In Touch</h2>
              
              <ul className="space-y-6 text-sm font-light text-stone-600">
                <li className="flex gap-4">
                  <MapPin size={18} className="text-studio-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-stone-450 mb-1">HQ Address</span>
                    {contactInfo?.addressLine1 || "142 Tribeca St, Penthouse B"}<br />
                    {contactInfo?.addressLine2 || "New York, NY 10013"}
                  </div>
                </li>
                <li className="flex gap-4">
                  <Phone size={18} className="text-studio-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-stone-450 mb-1">Direct Line</span>
                    {contactInfo?.phone || "+1 (212) 555-8902"}
                  </div>
                </li>
                <li className="flex gap-4">
                  <Mail size={18} className="text-studio-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-stone-450 mb-1">Electronic Mail</span>
                    {contactInfo?.email || "hello@aurainteriors.com"}
                  </div>
                </li>
                <li className="flex gap-4">
                  <Clock size={18} className="text-studio-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-stone-450 mb-1">Business Hours</span>
                    {contactInfo?.hoursLine1 || "Monday – Friday: 9:00 AM – 6:00 PM EST"}<br />
                    {contactInfo?.hoursLine2 || "Saturday: By Appointment Only"}
                  </div>
                </li>
              </ul>
            </div>

            {/* Embedded Google Map (Muted style) */}
            <div className="w-full aspect-[4/3] bg-stone-100 border border-stone-200 overflow-hidden shadow-md">
              <iframe
                title="Aura Studio NYC Location Map"
                src={contactInfo?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.484196145624!2d-74.01103852342884!3d40.707328971393695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a16df5f14e7%3A0xc0cf4b63e8a4a5!2sTribeca%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(1) contrast(1.1) invert(0.05)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
