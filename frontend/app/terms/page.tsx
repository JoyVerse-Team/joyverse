import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/signup">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Signup
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Terms of Service
            </CardTitle>
            <p className="text-gray-600">Last updated: December 2024</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using Joy-Verse, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Use License</h2>
                <p className="text-gray-600">
                  Permission is granted to temporarily download one copy of Joy-Verse materials for personal, non-commercial transitory viewing only.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">3. User Accounts</h2>
                <p className="text-gray-600">
                  You are responsible for safeguarding the password and for all activities that occur under your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Prohibited Uses</h2>
                <p className="text-gray-600">
                  You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Content</h2>
                <p className="text-gray-600">
                  Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Privacy Policy</h2>
                <p className="text-gray-600">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Termination</h2>
                <p className="text-gray-600">
                  We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Changes to Terms</h2>
                <p className="text-gray-600">
                  We reserve the right to modify these terms at any time. We will always post the most current version on our website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Contact Information</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms of Service, please contact us at support@joyverse.com.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
