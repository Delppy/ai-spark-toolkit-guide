
import React from 'react';

const PrivacyPolicy = () => {
  const currentDate = "June 14, 2025";

  return (
    <div className="bg-background text-foreground">
        <div className="container mx-auto max-w-4xl py-16 px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
                AiToUse Privacy Policy
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-4 sm:text-lg">
                Effective Date: {currentDate}
              </p>
              <p className="mt-1 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
                Last Updated: {currentDate}
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Introduction</h2>
                <div className="mt-4 space-y-4 text-lg text-gray-600 dark:text-gray-300">
                  <p>
                    AiToUse (“we,” “our,” or “us”) respects your privacy. This policy explains how we collect, use, and protect your information when you use our app.
                  </p>
                  <p>
                    By using AiToUse, you agree to the terms of this Privacy Policy.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. Information We Collect</h2>
                <div className="mt-4 space-y-4 text-lg text-gray-600 dark:text-gray-300">
                  <p>
                    We may collect the following information:
                  </p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li><strong>Personal Info:</strong> Name, email address, and profile photo (if provided)</li>
                    <li><strong>App Usage Data:</strong> Which prompts you interact with, bookmarked prompts, favorite categories</li>
                    <li><strong>Device Info:</strong> Type of device, OS version, crash reports</li>
                  </ul>
                  <p>
                    We do not collect or store any prompt content you type into external AI tools like ChatGPT.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. How We Use Your Information</h2>
                <div className="mt-4 space-y-4 text-lg text-gray-600 dark:text-gray-300">
                  <p>
                    We use your information to:
                  </p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Personalize your experience</li>
                    <li>Improve our prompt recommendations</li>
                    <li>Respond to your support requests</li>
                    <li>Monitor app performance and fix bugs</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. Third-Party Services</h2>
                <div className="mt-4 space-y-4 text-lg text-gray-600 dark:text-gray-300">
                  <p>
                    We may use third-party tools (e.g., analytics, payment providers) that have their own privacy practices. These may collect limited data necessary for their functions.
                  </p>
                  <p>
                    We do not sell or share your personal data with advertisers or unauthorized third parties.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">5. How We Protect Your Data</h2>
                <div className="mt-4 space-y-4 text-lg text-gray-600 dark:text-gray-300">
                  <ul className="list-disc space-y-2 pl-6">
                      <li>All data is encrypted in transit</li>
                      <li>Access to data is restricted to authorized team members only</li>
                      <li>We perform regular app security audits</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">6. Children’s Privacy</h2>
                <div className="mt-4 space-y-4 text-lg text-gray-600 dark:text-gray-300">
                  <p>
                    AiToUse is not intended for children under 13. We do not knowingly collect personal data from anyone under this age.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">7. Your Rights</h2>
                <div className="mt-4 space-y-4 text-lg text-gray-600 dark:text-gray-300">
                  <p>
                    You can:
                  </p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>View or update your profile information at any time</li>
                    <li>Request data deletion by emailing us at <a href="mailto:support@aitouse.app" className="text-primary hover:underline">support@aitouse.app</a></li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">8. Contact Us</h2>
                <div className="mt-4 space-y-4 text-lg text-gray-600 dark:text-gray-300">
                  <p>
                    If you have questions about this policy or your data, email us at: <a href="mailto:support@aitouse.app" className="text-primary hover:underline">support@aitouse.app</a>
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">9. Updates to This Policy</h2>
                <div className="mt-4 space-y-4 text-lg text-gray-600 dark:text-gray-300">
                  <p>
                    We may update this policy occasionally. We'll notify users in-app or via email if significant changes are made.
                  </p>
                </div>
              </section>
            </div>
          </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
