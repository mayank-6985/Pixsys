import React, { useState } from "react";
import { FiSend, FiArrowRight } from "react-icons/fi";
import ScrollReveal from "../components/ScrollReveal";
import api from "../api";

const countries = [
  { name: "Afghanistan", code: "AF", dialCode: "+93" },
  { name: "Aland Islands", code: "AX", dialCode: "+358" },
  { name: "Albania", code: "AL", dialCode: "+355" },
  { name: "Algeria", code: "DZ", dialCode: "+213" },
  { name: "American Samoa", code: "AS", dialCode: "+1684" },
  { name: "Andorra", code: "AD", dialCode: "+376" },
  { name: "Angola", code: "AO", dialCode: "+244" },
  { name: "Anguilla", code: "AI", dialCode: "+1264" },
  { name: "Antarctica", code: "AQ", dialCode: "+672" },
  { name: "Antigua and Barbuda", code: "AG", dialCode: "+1268" },
  { name: "Argentina", code: "AR", dialCode: "+54" },
  { name: "Armenia", code: "AM", dialCode: "+374" },
  { name: "Aruba", code: "AW", dialCode: "+297" },
  { name: "Australia", code: "AU", dialCode: "+61" },
  { name: "Austria", code: "AT", dialCode: "+43" },
  { name: "Azerbaijan", code: "AZ", dialCode: "+994" },
  { name: "Bahamas", code: "BS", dialCode: "+1242" },
  { name: "Bahrain", code: "BH", dialCode: "+973" },
  { name: "Bangladesh", code: "BD", dialCode: "+880" },
  { name: "Barbados", code: "BB", dialCode: "+1246" },
  { name: "Belarus", code: "BY", dialCode: "+375" },
  { name: "Belgium", code: "BE", dialCode: "+32" },
  { name: "Belize", code: "BZ", dialCode: "+501" },
  { name: "Benin", code: "BJ", dialCode: "+229" },
  { name: "Bermuda", code: "BM", dialCode: "+1441" },
  { name: "Bhutan", code: "BT", dialCode: "+975" },
  { name: "Bolivia", code: "BO", dialCode: "+591" },
  { name: "Bosnia and Herzegovina", code: "BA", dialCode: "+387" },
  { name: "Botswana", code: "BW", dialCode: "+267" },
  { name: "Brazil", code: "BR", dialCode: "+55" },
  { name: "British Indian Ocean Territory", code: "IO", dialCode: "+246" },
  { name: "Brunei Darussalam", code: "BN", dialCode: "+673" },
  { name: "Bulgaria", code: "BG", dialCode: "+359" },
  { name: "Burkina Faso", code: "BF", dialCode: "+226" },
  { name: "Burundi", code: "BI", dialCode: "+257" },
  { name: "Cambodia", code: "KH", dialCode: "+855" },
  { name: "Cameroon", code: "CM", dialCode: "+237" },
  { name: "Canada", code: "CA", dialCode: "+1" },
  { name: "Cape Verde", code: "CV", dialCode: "+238" },
  { name: "Cayman Islands", code: "KY", dialCode: "+1345" },
  { name: "Central African Republic", code: "CF", dialCode: "+236" },
  { name: "Chad", code: "TD", dialCode: "+235" },
  { name: "Chile", code: "CL", dialCode: "+56" },
  { name: "China", code: "CN", dialCode: "+86" },
  { name: "Christmas Island", code: "CX", dialCode: "+61" },
  { name: "Cocos (Keeling) Islands", code: "CC", dialCode: "+61" },
  { name: "Colombia", code: "CO", dialCode: "+57" },
  { name: "Comoros", code: "KM", dialCode: "+269" },
  { name: "Congo", code: "CG", dialCode: "+242" },
  { name: "Costa Rica", code: "CR", dialCode: "+506" },
  { name: "Cote D'Ivoire", code: "CI", dialCode: "+225" },
  { name: "Croatia", code: "HR", dialCode: "+385" },
  { name: "Cuba", code: "CU", dialCode: "+53" },
  { name: "Cyprus", code: "CY", dialCode: "+357" },
  { name: "Czech Republic", code: "CZ", dialCode: "+420" },
  { name: "Denmark", code: "DK", dialCode: "+45" },
  { name: "Djibouti", code: "DJ", dialCode: "+253" },
  { name: "Dominica", code: "DM", dialCode: "+1767" },
  { name: "Dominican Republic", code: "DO", dialCode: "+1809" },
  { name: "Ecuador", code: "EC", dialCode: "+593" },
  { name: "Egypt", code: "EG", dialCode: "+20" },
  { name: "El Salvador", code: "SV", dialCode: "+503" },
  { name: "Equatorial Guinea", code: "GQ", dialCode: "+240" },
  { name: "Eritrea", code: "ER", dialCode: "+291" },
  { name: "Estonia", code: "EE", dialCode: "+372" },
  { name: "Ethiopia", code: "ET", dialCode: "+251" },
  { name: "Falkland Islands (Malvinas)", code: "FK", dialCode: "+500" },
  { name: "Faroe Islands", code: "FO", dialCode: "+298" },
  { name: "Fiji", code: "FJ", dialCode: "+679" },
  { name: "Finland", code: "FI", dialCode: "+358" },
  { name: "France", code: "FR", dialCode: "+33" },
  { name: "French Guiana", code: "GF", dialCode: "+594" },
  { name: "French Polynesia", code: "PF", dialCode: "+689" },
  { name: "Gabon", code: "GA", dialCode: "+241" },
  { name: "Gambia", code: "GM", dialCode: "+220" },
  { name: "Georgia", code: "GE", dialCode: "+995" },
  { name: "Germany", code: "DE", dialCode: "+49" },
  { name: "Ghana", code: "GH", dialCode: "+233" },
  { name: "Gibraltar", code: "GI", dialCode: "+350" },
  { name: "Greece", code: "GR", dialCode: "+30" },
  { name: "Greenland", code: "GL", dialCode: "+299" },
  { name: "Grenada", code: "GD", dialCode: "+1473" },
  { name: "Guadeloupe", code: "GP", dialCode: "+590" },
  { name: "Guam", code: "GU", dialCode: "+1671" },
  { name: "Guatemala", code: "GT", dialCode: "+502" },
  { name: "Guernsey", code: "GG", dialCode: "+44" },
  { name: "Guinea", code: "GN", dialCode: "+224" },
  { name: "Guinea-Bissau", code: "GW", dialCode: "+245" },
  { name: "Guyana", code: "GY", dialCode: "+592" },
  { name: "Haiti", code: "HT", dialCode: "+509" },
  { name: "Honduras", code: "HN", dialCode: "+504" },
  { name: "Hong Kong", code: "HK", dialCode: "+852" },
  { name: "Hungary", code: "HU", dialCode: "+36" },
  { name: "Iceland", code: "IS", dialCode: "+354" },
  { name: "India", code: "IN", dialCode: "+91" },
  { name: "Indonesia", code: "ID", dialCode: "+62" },
  { name: "Iran", code: "IR", dialCode: "+98" },
  { name: "Iraq", code: "IQ", dialCode: "+964" },
  { name: "Ireland", code: "IE", dialCode: "+353" },
  { name: "Isle of Man", code: "IM", dialCode: "+44" },
  { name: "Israel", code: "IL", dialCode: "+972" },
  { name: "Italy", code: "IT", dialCode: "+39" },
  { name: "Jamaica", code: "JM", dialCode: "+1876" },
  { name: "Japan", code: "JP", dialCode: "+81" },
  { name: "Jersey", code: "JE", dialCode: "+44" },
  { name: "Jordan", code: "JO", dialCode: "+962" },
  { name: "Kazakhstan", code: "KZ", dialCode: "+7" },
  { name: "Kenya", code: "KE", dialCode: "+254" },
  { name: "Kiribati", code: "KI", dialCode: "+686" },
  { name: "Kuwait", code: "KW", dialCode: "+965" },
  { name: "Kyrgyzstan", code: "KG", dialCode: "+996" },
];
const initialState = {
  full_name: "",
  phone_number: "",
  email_address: "",
  poul: "",
  industry: "",
  product_of_interest: "",
  description: "",
};

const About = () => {
  const [formData, setFormData] = useState(initialState);
  const [countryCode, setCountryCode] = useState("+91");
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const payload = {
      ...formData,
      phone_number: `${countryCode} ${formData.phone_number}`,
    };

    try {
      await api.post("contactus/inquiries/", payload);
      setStatus("success");
      setFormData(initialState);
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
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
                Something went wrong while submitting your request. Please try
                again.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  placeholder="John Doe"
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-4 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-sm placeholder:text-zinc-400 disabled:opacity-60"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                  Phone Number *
                </label>
                <div className="flex">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={status === "loading"}
                    className="bg-zinc-100 border border-zinc-300 border-r-0 text-zinc-900 px-3 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-l-sm disabled:opacity-60 cursor-pointer focus:z-10"
                  >
                    {countries.map((country) => (
                      <option value={`${country.dialCode}${country.code}`}>
                        {`${country.dialCode}${country.code}`}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phone_number"
                    required
                    value={formData.phone_number}
                    onChange={handleChange}
                    disabled={status === "loading"}
                    placeholder="98765 43210"
                    className="w-full bg-white border border-zinc-300 text-zinc-900 px-4 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-r-sm placeholder:text-zinc-400 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email_address"
                  required
                  value={formData.email_address}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  placeholder="john@company.com"
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-4 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-sm placeholder:text-zinc-400 disabled:opacity-60"
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
                  disabled={status === "loading"}
                  placeholder="Enter Poul details"
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-4 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-sm placeholder:text-zinc-400 disabled:opacity-60"
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
                  disabled={status === "loading"}
                  placeholder="e.g. Manufacturing, Solar"
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-4 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-sm placeholder:text-zinc-400 disabled:opacity-60"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">
                  Product of Interest
                </label>
                <input
                  type="text"
                  name="product_of_interest"
                  value={formData.product_of_interest}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  placeholder="e.g. Servo Drives, PLC"
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-4 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-sm placeholder:text-zinc-400 disabled:opacity-60"
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
                  disabled={status === "loading"}
                  placeholder="How can we help you?"
                  className="w-full bg-white border border-zinc-300 text-zinc-900 px-4 py-3 outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] transition-all rounded-sm placeholder:text-zinc-400 resize-y disabled:opacity-60"
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
