import { motion } from 'framer-motion';
import { FiRefreshCw, FiCheckCircle, FiXCircle, FiClock, FiCreditCard, FiAlertTriangle } from 'react-icons/fi';
import { staggerContainer, staggerItem, pageTransition } from '../animations/motionVariants';

const eligibleCases = [
  'Order was never delivered to your address',
  'Wrong items delivered that differ from your order',
  'Food was spoiled, damaged, or of unacceptable quality',
  'Duplicate payment was charged for the same order',
  'Payment failed but amount was deducted from your account',
  'Restaurant cancelled your order after confirmation',
];

const nonRefundableCases = [
  'Order cancelled after the 2-minute cancellation window',
  'Incorrect address provided during checkout',
  'Customer was unavailable at the delivery location',
  'Order fully and correctly delivered as described',
  'Change of mind after food preparation has started',
  'Partial consumption of delivered food items',
];

const refundTimeline = [
  { step: '01', label: 'Submit Request', desc: 'Contact us within 24 hours of delivery', time: 'Day 1' },
  { step: '02', label: 'Review Process', desc: 'Our team reviews your refund request', time: '1–2 Days' },
  { step: '03', label: 'Approval', desc: 'Refund approved and initiated via Razorpay', time: '2–3 Days' },
  { step: '04', label: 'Credit Received', desc: 'Amount credited to original payment method', time: '5–7 Days' },
];

const RefundPolicy = () => {
  return (
    <motion.div {...pageTransition}>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-dark to-dark-lighter" />
        <div className="absolute top-10 right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div
              variants={staggerItem}
              className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-green-500/20"
            >
              <FiRefreshCw size={14} />
              Hassle-Free Returns
            </motion.div>
            <motion.h1
              variants={staggerItem}
              className="font-display text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Refund{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Policy
              </span>
            </motion.h1>
            <motion.p variants={staggerItem} className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              We want every order to be perfect. If something goes wrong, our fair refund policy ensures you're protected and taken care of.
            </motion.p>
            <motion.p variants={staggerItem} className="text-gray-500 text-sm mt-4">
              Last updated: April 2025
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-10">

        {/* Razorpay Refund Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 flex items-start gap-4"
        >
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
            <FiCreditCard className="text-primary" size={20} />
          </div>
          <div>
            <p className="text-white font-semibold">Refunds via Razorpay</p>
            <p className="text-gray-400 text-sm mt-1 leading-relaxed">
              All approved refunds are processed through our payment gateway partner, Razorpay. The refund will be credited back to the original payment method (UPI, debit/credit card, netbanking, or wallet) within 5–7 business days, depending on your bank's processing time.
            </p>
          </div>
        </motion.div>

        {/* Eligible / Not Eligible */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-dark-lighter/50 border border-green-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-green-500/10 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="text-green-400" size={18} />
              </div>
              <h2 className="text-white font-semibold text-lg">Eligible for Refund</h2>
            </div>
            <ul className="space-y-3">
              {eligibleCases.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                  <span className="text-green-400 mt-1 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-dark-lighter/50 border border-red-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-red-500/10 rounded-xl flex items-center justify-center">
                <FiXCircle className="text-red-400" size={18} />
              </div>
              <h2 className="text-white font-semibold text-lg">Not Eligible for Refund</h2>
            </div>
            <ul className="space-y-3">
              {nonRefundableCases.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                  <span className="text-red-400 mt-1 shrink-0">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Refund Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-dark-lighter/50 border border-white/10 rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <FiClock className="text-primary" size={18} />
            </div>
            <h2 className="text-white font-semibold text-xl">Refund Timeline</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {refundTimeline.map((item, i) => (
              <div key={i} className="text-center relative">
                {i < refundTimeline.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-white text-sm">
                  {item.step}
                </div>
                <div className="text-primary text-xs font-medium mb-1">{item.time}</div>
                <div className="text-white font-semibold text-sm mb-1">{item.label}</div>
                <div className="text-gray-500 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How to Request */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-dark-lighter/50 border border-white/10 rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <FiAlertTriangle className="text-primary" size={18} />
            </div>
            <h2 className="text-white font-semibold text-xl">How to Request a Refund</h2>
          </div>
          <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
            <p>▸ Contact our support team within <span className="text-white font-medium">24 hours</span> of receiving your order.</p>
            <p>▸ Email us at <a href="mailto:support@foodiehub.com" className="text-primary hover:underline">support@foodiehub.com</a> with your order ID and issue description.</p>
            <p>▸ Include photos of the issue (wrong/damaged items) for faster processing.</p>
            <p>▸ Our team will review your request and respond within <span className="text-white font-medium">1–2 business days</span>.</p>
            <p>▸ Once approved, the refund will reflect in your account within <span className="text-white font-medium">5–7 business days</span> via Razorpay.</p>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default RefundPolicy;
