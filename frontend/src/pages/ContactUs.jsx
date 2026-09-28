import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageSquare,
  FiPackage, FiCreditCard, FiHelpCircle,
} from 'react-icons/fi';
import { staggerContainer, staggerItem, pageTransition } from '../animations/motionVariants';
import toast from 'react-hot-toast';

const contactInfo = [
  {
    icon: FiMail,
    label: 'Email Support',
    value: 'support@foodiehub.com',
    sub: 'We reply within 24 hours',
    href: 'mailto:support@foodiehub.com',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: FiPhone,
    label: 'Phone Support',
    value: '+91 9988776655',
    sub: 'Mon–Sat, 9AM–8PM IST',
    href: 'tel:+919988776655',
    color: 'from-green-500 to-teal-500',
  },
  {
    icon: FiMapPin,
    label: 'Office Address',
    value: 'Connaught Place, New Delhi',
    sub: 'Delhi — 110001, India',
    href: null,
    color: 'from-blue-500 to-purple-500',
  },
  {
    icon: FiClock,
    label: 'Working Hours',
    value: 'Mon – Sat',
    sub: '9:00 AM – 8:00 PM IST',
    href: null,
    color: 'from-yellow-500 to-orange-500',
  },
];

const topics = [
  { icon: FiPackage, label: 'Order Issue' },
  { icon: FiCreditCard, label: 'Payment / Refund' },
  { icon: FiMessageSquare, label: 'Feedback' },
  { icon: FiHelpCircle, label: 'Other' },
];

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSending(true);
    // Simulate sending
    await new Promise((res) => setTimeout(res, 1500));
    setSending(false);
    toast.success('Message sent! We\'ll get back to you within 24 hours. 🎉');
    setForm({ name: '', email: '', phone: '', topic: '', message: '' });
  };

  return (
    <motion.div {...pageTransition}>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-dark to-dark-lighter" />
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div
              variants={staggerItem}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-primary/20"
            >
              <FiMessageSquare size={14} />
              We're Here to Help
            </motion.div>
            <motion.h1
              variants={staggerItem}
              className="font-display text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Contact{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Us
              </span>
            </motion.h1>
            <motion.p variants={staggerItem} className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Have a question, issue, or feedback? Our support team is ready to help. Reach out and we'll respond as soon as possible.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">

        {/* Contact Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {contactInfo.map((info, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="bg-dark-lighter/50 border border-white/10 rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className={`w-11 h-11 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <info.icon className="text-white" size={18} />
              </div>
              <p className="text-gray-500 text-xs mb-1">{info.label}</p>
              {info.href ? (
                <a href={info.href} className="text-white font-semibold text-sm hover:text-primary transition-colors block mb-1">
                  {info.value}
                </a>
              ) : (
                <p className="text-white font-semibold text-sm mb-1">{info.value}</p>
              )}
              <p className="text-gray-500 text-xs">{info.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Form + Map */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-dark-lighter/50 border border-white/10 rounded-2xl p-6 md:p-8"
          >
            <h2 className="text-white font-display font-semibold text-2xl mb-2">Send a Message</h2>
            <p className="text-gray-400 text-sm mb-6">We'll get back to you within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs mb-2 block">Topic</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {topics.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, topic: t.label }))}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium transition-all duration-300 ${
                        form.topic === t.label
                          ? 'bg-primary/20 border-primary text-primary'
                          : 'bg-dark border-gray-700 text-gray-400 hover:border-primary/40'
                      }`}
                    >
                      <t.icon size={16} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your issue or feedback in detail..."
                  className="input-field resize-none"
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={sending}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend size={16} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Payment Support */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FiCreditCard className="text-primary" size={18} />
                </div>
                <h3 className="text-white font-semibold">Payment Support</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                For payment-related queries (Razorpay refunds, failed transactions, duplicate charges), email us with your Order ID and transaction reference number for fastest resolution.
              </p>
              <a
                href="mailto:payments@foodiehub.com"
                className="inline-block mt-4 text-primary text-sm hover:underline"
              >
                payments@foodiehub.com →
              </a>
            </div>

            {/* FAQ */}
            <div className="bg-dark-lighter/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <FiHelpCircle className="text-primary" size={18} />
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {[
                  {
                    q: 'How long do refunds take?',
                    a: '5–7 business days to your original payment method via Razorpay.',
                  },
                  {
                    q: 'Can I cancel my order?',
                    a: 'Yes, within 2 minutes of placing. After that, the restaurant begins preparation.',
                  },
                  {
                    q: 'What if I received the wrong item?',
                    a: 'Contact us within 24 hours with photos and we\'ll issue a full refund.',
                  },
                ].map((faq, i) => (
                  <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <p className="text-white text-sm font-medium mb-1">{faq.q}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-dark-lighter/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Expected Response Times</h3>
              <div className="space-y-3">
                {[
                  { channel: 'Email', time: '< 24 hours', color: 'bg-green-500' },
                  { channel: 'Phone', time: 'Immediate (Business Hours)', color: 'bg-blue-500' },
                  { channel: 'Payment Issues', time: '< 48 hours', color: 'bg-yellow-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 ${item.color} rounded-full`} />
                      <span className="text-gray-400 text-sm">{item.channel}</span>
                    </div>
                    <span className="text-white text-xs font-medium">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default ContactUs;
