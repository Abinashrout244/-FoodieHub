import { motion } from 'framer-motion';
import { FiShield, FiLock, FiEye, FiDatabase, FiMail } from 'react-icons/fi';
import { fadeInUp, staggerContainer, staggerItem, pageTransition } from '../animations/motionVariants';

const sections = [
  {
    icon: FiDatabase,
    title: 'Information We Collect',
    content: [
      'Personal identification information (name, email address, phone number)',
      'Delivery address and location data for order fulfillment',
      'Payment information processed securely via Razorpay (we do not store card details)',
      'Order history and preferences to improve your experience',
      'Device information, browser type, and IP address for security purposes',
      'Cookies and usage data to enhance website functionality',
    ],
  },
  {
    icon: FiEye,
    title: 'How We Use Your Information',
    content: [
      'Process and fulfill your food orders efficiently',
      'Send order confirmations, updates, and delivery notifications',
      'Process payments securely through our Razorpay payment gateway',
      'Personalize your experience with relevant recommendations',
      'Improve our services, app performance, and customer support',
      'Comply with legal obligations and prevent fraudulent activities',
    ],
  },
  {
    icon: FiLock,
    title: 'Data Security',
    content: [
      'All payment transactions are encrypted using SSL/TLS technology',
      'We partner with Razorpay, a PCI DSS compliant payment gateway',
      'Your card details are never stored on our servers',
      'We implement industry-standard security measures to protect your data',
      'Regular security audits are conducted to ensure data protection',
      'Access to personal data is limited to authorized personnel only',
    ],
  },
  {
    icon: FiShield,
    title: 'Your Rights',
    content: [
      'Right to access your personal data we hold about you',
      'Right to correct inaccurate or incomplete information',
      'Right to delete your account and associated personal data',
      'Right to opt out of marketing communications at any time',
      'Right to data portability — request a copy of your data',
      'Right to lodge a complaint with regulatory authorities',
    ],
  },
];

const PrivacyPolicy = () => {
  return (
    <motion.div {...pageTransition}>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-dark to-dark-lighter" />
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={staggerItem}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-primary/20"
            >
              <FiShield size={14} />
              Your Privacy Matters
            </motion.div>
            <motion.h1
              variants={staggerItem}
              className="font-display text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Privacy{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Policy
              </span>
            </motion.h1>
            <motion.p variants={staggerItem} className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              We are committed to protecting your personal information. This policy explains how FoodieHub collects, uses, and safeguards your data.
            </motion.p>
            <motion.p variants={staggerItem} className="text-gray-500 text-sm mt-4">
              Last updated: April 2025
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Razorpay Note */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 mb-10"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
              <FiLock className="text-primary" size={18} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Razorpay Payment Security</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                FoodieHub uses Razorpay as its payment gateway. All payment information is processed directly by Razorpay on their secure, PCI DSS Level 1 certified servers. We never receive or store your full card details. For Razorpay's privacy practices, visit{' '}
                <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  razorpay.com/privacy
                </a>.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {sections.map((section, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="bg-dark-lighter/50 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <section.icon className="text-primary" size={18} />
                </div>
                <h2 className="text-white font-display font-semibold text-xl">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                    <span className="text-primary mt-1 shrink-0">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact */}
          <motion.div
            variants={staggerItem}
            className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6 md:p-8 text-center"
          >
            <FiMail className="text-primary mx-auto mb-3" size={28} />
            <h2 className="text-white font-semibold text-xl mb-2">Questions About Privacy?</h2>
            <p className="text-gray-400 text-sm mb-4">
              If you have any questions about this Privacy Policy or how we handle your data, please contact us.
            </p>
            <a
              href="mailto:support@foodiehub.com"
              className="inline-block bg-primary hover:bg-primary/80 text-white font-medium px-6 py-2.5 rounded-xl transition-all duration-300"
            >
              support@foodiehub.com
            </a>
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default PrivacyPolicy;
