import React, { useState } from "react";
import { FiSend, FiArrowRight } from "react-icons/fi";
import ScrollReveal from "../components/ScrollReveal";
const About = () => {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    poul: "",
    industry: "",
    product: "",
    description: "",
  });

  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("aboutus/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form.");
      }

      setStatus("success");
      setFormData({
        name: "",
        number: "",
        email: "",
        poul: "",
        industry: "",
        product: "",
        description: "",
      });

      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Submission Error:", error);
      setStatus("error");
    }
  };

  return (
    <section className="bg-white py-24 lg:py-32 border-t border-zinc-200">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="mb-12 text-center">
            <h2 className="text-sm font-bold text-[#da0e19] uppercase tracking-[0.2em] mb-4">
              Get in Touch
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase tracking-tight leading-[1.1]">
              Partner With Us
            </h3>
            <p className="mt-4 text-zinc-500 max-w-2xl mx-auto">
              Fill out the form below to request more information about our
              industrial solutions. Our team will get back to you shortly.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-50 p-8 md:p-12 border border-zinc-200 rounded-sm shadow-sm"
          >
            {status === "success" && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-sm text-sm font-medium">
                Thank you! Your message has been sent successfully. We will be
                in touch soon.
              </div>
            )}
            {status === "error" && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 text-[#da0e19] rounded-sm text-sm font-medium">
                Something went wrong. Please try submitting the form again.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-4 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-sm placeholder:text-zinc-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="number"
                  required
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-4 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-sm placeholder:text-zinc-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-4 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-sm placeholder:text-zinc-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                  Poul
                </label>
                <input
                  type="text"
                  name="poul"
                  value={formData.poul}
                  onChange={handleChange}
                  placeholder="Enter Poul details"
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-4 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-sm placeholder:text-zinc-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="e.g. Manufacturing, Solar"
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-4 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-sm placeholder:text-zinc-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                  Product of Interest
                </label>
                <input
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  placeholder="e.g. Servo Drives, PLC"
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-4 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-sm placeholder:text-zinc-400"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                  Description / Message *
                </label>
                <textarea
                  name="description"
                  required
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-4 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-sm placeholder:text-zinc-400 resize-y"
                ></textarea>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="submit"
                disabled={status === "loading"}
                className={`group inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white font-bold text-sm uppercase tracking-widest hover:bg-[#da0e19] transition-colors duration-300 rounded-sm disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </span>
                ) : (
                  <>
                    Send Message
                    <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
};
export default About;
