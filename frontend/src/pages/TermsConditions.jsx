import { motion } from 'framer-motion';
import { FiFileText, FiAlertCircle, FiCheckCircle, FiCreditCard, FiTruck, FiX } from 'react-icons/fi';
import { staggerContainer, staggerItem, pageTransition } from '../animations/motionVariants';

const terms = [
  {
    icon: FiCheckCircle,
    title: '1. Acceptance of Terms',
    content: `By accessing or using the FoodieHub platform (website or mobile application), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access or use our services. These terms apply to all users including browsers, customers, merchants, and contributors.`,
  },
  {
    icon: FiFileText,
    title: '2. Use of Platform',
    content: `FoodieHub grants you a limited, non-exclusive, non-transferable license to access and use the platform solely for ordering food products for personal, non-commercial use. You agree not to misuse our services, attempt unauthorized access, or engage in any activity that disrupts or damages the platform or other users' experience.`,
  },
  {
    icon: FiCreditCard,
    title: '3. Payments & Razorpay',
    content: `All payments on FoodieHub are processed securely through Razorpay, our authorized payment gateway partner. By making a payment, you agree to Razorpay's Terms of Service and Privacy Policy. FoodieHub does not store your payment card details. In case of payment failure, the amount will be automatically refunded to your original payment method within 5–7 business days.`,
  },
  {
    icon: FiTruck,
    title: '4. Orders & Delivery',
    content: `Once an order is placed and confirmed, it enters processing immediately. Delivery times are estimates and may vary based on location, restaurant preparation time, and demand. FoodieHub is not liable for delays caused by external factors. You must provide accurate delivery address information. Failed deliveries due to incorrect address are non-refundable.`,
  },
  {
    icon: FiX,
    title: '5. Cancellation Policy',
    content: `Orders can be cancelled within 2 minutes of placement for a full refund. After this window, cancellations may not be possible as the restaurant begins preparation. In cases where cancellation is accepted, refunds are processed within 5–7 business days to the original payment method via Razorpay.`,
  },
  {
    icon: FiAlertCircle,
    title: '6. User Account',
    content: `You are responsible for maintaining the confidentiality of your account credentials. You agree to notify FoodieHub immediately of any unauthorized account access. FoodieHub reserves the right to terminate accounts that violate these terms, engage in fraudulent activities, or misuse the platform. Each person may maintain only one account.`,
  },
  {
    icon: FiFileText,
    title: '7. Intellectual Property',
    content: `All content on FoodieHub — including logos, text, images, graphics, and software — is the exclusive property of FoodieHub and is protected under applicable copyright and intellectual property laws. You may not copy, distribute, or reproduce any content without our explicit written permission.`,
  },
  {
    icon: FiAlertCircle,
    title: '8. Limitation of Liability',
    content: `FoodieHub shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our platform, including loss of profits, data, or goodwill. Our total liability for any claim shall not exceed the amount paid by you for the specific transaction giving rise to the claim, subject to applicable laws.`,
  },
  {
    icon: FiFileText,
    title: '9. Governing Law',
    content: `These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts located in Delhi, India. By using our platform, you consent to this jurisdiction.`,
  },
  {
    icon: FiFileText,
    title: '10. Changes to Terms',
    content: `FoodieHub reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the website. Continued use of the platform after any modifications constitutes your acceptance of the updated terms. We encourage you to review these terms periodically.`,
  },
];

const TermsConditions = () => {
  return (
    <motion.div {...pageTransition}>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-dark to-dark-lighter" />
        <div className="absolute top-10 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div
              variants={staggerItem}
              className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-accent/20"
            >
              <FiFileText size={14} />
              Legal Agreement
            </motion.div>
            <motion.h1
              variants={staggerItem}
              className="font-display text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Terms &{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Conditions
              </span>
            </motion.h1>
            <motion.p variants={staggerItem} className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Please read these Terms and Conditions carefully before using FoodieHub. By using our service, you agree to these terms.
            </motion.p>
            <motion.p variants={staggerItem} className="text-gray-500 text-sm mt-4">
              Last updated: April 2025 · Effective immediately
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Razorpay Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-5 mb-10 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
            <FiCreditCard className="text-blue-400" size={20} />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Razorpay Powered Payments</p>
            <p className="text-gray-400 text-xs mt-1">
              Payments on FoodieHub are powered by Razorpay. By completing a purchase, you also agree to{' '}
              <a href="https://razorpay.com/terms/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Razorpay's Terms of Service
              </a>. All transactions are encrypted and secure.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {terms.map((term, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="bg-dark-lighter/50 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                  <term.icon className="text-primary" size={16} />
                </div>
                <h2 className="text-white font-semibold text-lg">{term.title}</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{term.content}</p>
            </motion.div>
          ))}

          {/* Contact Footer */}
          <motion.div
            variants={staggerItem}
            className="text-center text-gray-500 text-sm pt-4"
          >
            For questions about these terms, contact us at{' '}
            <a href="mailto:legal@foodiehub.com" className="text-primary hover:underline">
              legal@foodiehub.com
            </a>
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default TermsConditions;
