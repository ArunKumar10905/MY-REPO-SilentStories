import React from 'react';
import { motion } from 'framer-motion';

function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8"
      >
        <h1 className="text-4xl font-bold text-secondary-800 dark:text-white mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-secondary-700 dark:text-secondary-300">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 dark:text-white mb-3">
              Information We Collect
            </h2>
            <p>
              We collect minimal information to provide you with the best reading experience:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Your name (as provided by you for reading and commenting)</li>
              <li>Comments and ratings you submit</li>
              <li>Basic usage analytics (page views, reading time)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 dark:text-white mb-3">
              How We Use Your Information
            </h2>
            <p>
              Your information is used solely for:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Displaying your name with your comments</li>
              <li>Improving our content based on reader engagement</li>
              <li>Providing personalized reading experiences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 dark:text-white mb-3">
              Data Storage and Security
            </h2>
            <p>
              We take your privacy seriously. All data is stored securely and is never shared with third parties.
              Your name is stored locally in your browser and on our secure servers only for the purpose of
              displaying it with your comments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 dark:text-white mb-3">
              Your Rights
            </h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Change your display name at any time</li>
              <li>Request deletion of your comments</li>
              <li>Request export of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 dark:text-white mb-3">
              Cookies and Local Storage
            </h2>
            <p>
              We use browser local storage to remember your name and preferences. This data never leaves
              your device unless you submit a comment. You can clear this data at any time through your
              browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 dark:text-white mb-3">
              Contact
            </h2>
            <p>
              If you have any questions about this Privacy Policy or wish to exercise your rights,
              please contact the site administrator.
            </p>
          </section>

          <section className="pt-4 border-t border-secondary-200 dark:border-secondary-700">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

export default PrivacyPolicy;
