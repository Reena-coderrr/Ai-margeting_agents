"use client";
import React, { useState } from "react";
import { Mail, Phone, MapPin, User } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-0">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-12 mb-8">
        <div className="bg-blue-600 rounded-full p-4 mb-4 shadow-lg">
          <Mail className="text-white text-4xl" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Contact Us</h1>
        <p className="text-lg text-gray-600 text-center max-w-xl">
          Have questions or need support? Our team is here to help you succeed with AI Marketing Agents.
        </p>
      </div>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 px-4">
        {/* Contact Form Card */}
        <div className="backdrop-blur-md bg-white/80 rounded-2xl shadow-2xl p-8 flex flex-col justify-center border border-blue-100 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Send Us a Message</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative">
              <User className="absolute left-3 top-3 text-blue-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-blue-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Your Email"
                required
              />
            </div>
            <div className="relative">
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-lg pl-3 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Your Message"
                rows={5}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              disabled={submitted}
            >
              {submitted ? "Message Sent!" : "Send Message"}
            </button>
          </form>
        </div>
        {/* Contact Info & Map */}
        <div className="flex flex-col gap-8 justify-center animate-fade-in">
          <div className="bg-white/80 rounded-2xl shadow p-6 border border-blue-100">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Contact Information</h2>
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="text-blue-500" />
              <span>123 AI Avenue, Tech City, 12345</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Mail className="text-blue-500" />
              <a href="mailto:support@aimarketingagents.com" className="text-blue-700 underline">support@aimarketingagents.com</a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-blue-500" />
              <a href="tel:+1234567890" className="text-blue-700 underline">+1 (234) 567-890</a>
            </div>
          </div>
          <div className="bg-white/80 rounded-2xl shadow p-4 border border-blue-100">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">Our Location</h2>
            <div className="w-full h-48 rounded-lg overflow-hidden shadow">
              <iframe
                title="Our Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537363153169!3d-37.8162797797517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f1f1f1%3A0x5045675218ce6e0!2sTech%20City!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 