import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SnippetlyLogo } from "@/components/snippetly-logo"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <SnippetlyLogo href="/" />
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Agreement to Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  By accessing and using Snippetly ("the Service"), you accept and agree to be bound by the terms and
                  provision of this agreement. If you do not agree to abide by the above, please do not use this
                  service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description of Service</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>Snippetly is a web-based code snippet management platform that allows users to:</p>
                <ul>
                  <li>Save, organize, and manage code snippets</li>
                  <li>Search and filter snippets by various criteria</li>
                  <li>Tag and categorize code for better organization</li>
                  <li>Mark snippets as favorites for quick access</li>
                  <li>Share snippets with other users (when available)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Accounts and Registration</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>To use Snippetly, you must:</p>
                <ul>
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Be at least 13 years of age</li>
                  <li>Use the service in compliance with all applicable laws</li>
                </ul>
                <p>
                  You are responsible for all activities that occur under your account and for maintaining the
                  confidentiality of your password.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acceptable Use Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>You agree not to use Snippetly to:</p>
                <ul>
                  <li>Store or share malicious code, viruses, or harmful software</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights of others</li>
                  <li>Share personal information of others without consent</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use the service for commercial purposes without authorization</li>
                  <li>Spam, harass, or abuse other users</li>
                  <li>Store content that is illegal, harmful, or offensive</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Ownership and License</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4 className="font-semibold">Your Content</h4>
                <p>
                  You retain ownership of all code snippets and content you create and store on Snippetly. By using our
                  service, you grant us a limited license to store, process, and display your content solely for the
                  purpose of providing the service.
                </p>

                <h4 className="font-semibold mt-6">Our Content</h4>
                <p>
                  The Snippetly platform, including its design, features, and functionality, is owned by us and
                  protected by copyright and other intellectual property laws.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Plans and Pricing</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4 className="font-semibold">Free Plan</h4>
                <ul>
                  <li>Up to 100 code snippets</li>
                  <li>Full search and organization features</li>
                  <li>Basic support</li>
                </ul>

                <h4 className="font-semibold mt-6">Pro Plan (Coming Soon)</h4>
                <ul>
                  <li>Unlimited code snippets</li>
                  <li>Team collaboration features</li>
                  <li>Advanced sharing options</li>
                  <li>Priority support</li>
                  <li>$9/month subscription</li>
                </ul>

                <p className="mt-4">
                  Pricing is subject to change with 30 days notice. Current users will be grandfathered into existing
                  pricing for 12 months after any price changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refund Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4 className="font-semibold">Free Plan</h4>
                <p>The free plan requires no payment and therefore no refunds are applicable.</p>

                <h4 className="font-semibold mt-6">Pro Plan Refunds</h4>
                <p>
                  We offer a 30-day money-back guarantee for Pro plan subscriptions. You may request a full refund
                  within 30 days of your initial subscription or renewal for any reason.
                </p>

                <h4 className="font-semibold mt-6">Refund Process</h4>
                <ul>
                  <li>Refund requests must be submitted within 30 days of payment</li>
                  <li>Contact support@snippetly.com with your refund request</li>
                  <li>Include your account email and reason for refund (optional)</li>
                  <li>Refunds are processed within 5-10 business days</li>
                  <li>Refunds are issued to the original payment method</li>
                </ul>

                <h4 className="font-semibold mt-6">Refund Exceptions</h4>
                <p>Refunds may be denied in cases of:</p>
                <ul>
                  <li>Violation of our Terms of Service or Acceptable Use Policy</li>
                  <li>Fraudulent or abusive refund requests</li>
                  <li>Requests made after the 30-day refund period</li>
                  <li>Accounts that have been suspended or terminated for policy violations</li>
                </ul>

                <h4 className="font-semibold mt-6">Subscription Cancellation</h4>
                <p>
                  You may cancel your Pro subscription at any time through your account settings. Cancellation will take
                  effect at the end of your current billing period, and you will retain Pro features until that date. No
                  partial refunds are provided for mid-cycle cancellations unless within the 30-day refund window.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Backup and Loss</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  While we implement robust backup systems and security measures, you are responsible for maintaining
                  your own backups of important code snippets. We recommend regularly exporting your data and are not
                  liable for any data loss, though we will make reasonable efforts to recover lost data when possible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Availability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We strive to maintain high service availability but do not guarantee uninterrupted access. We may
                  temporarily suspend the service for maintenance, updates, or due to circumstances beyond our control.
                  We will provide advance notice when possible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Snippetly is provided "as is" without warranties of any kind. We shall not be liable for any indirect,
                  incidental, special, or consequential damages arising from your use of the service. Our total
                  liability shall not exceed the amount you paid for the service in the 12 months preceding the claim.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Termination</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We may terminate or suspend your account immediately, without prior notice, for conduct that we
                  believe violates these Terms of Service or is harmful to other users, us, or third parties. You may
                  also terminate your account at any time through your account settings.
                </p>
                <p>
                  Upon termination, your right to use the service will cease immediately, and we may delete your account
                  and data after a reasonable grace period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We reserve the right to modify these terms at any time. We will notify users of material changes via
                  email or through the service. Your continued use of Snippetly after changes become effective
                  constitutes acceptance of the new terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  These Terms of Service are governed by and construed in accordance with the laws of [Your
                  Jurisdiction], without regard to its conflict of law provisions. Any disputes arising from these terms
                  will be resolved through binding arbitration.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <ul>
                  <li>Email: support@snippetly.com</li>
                  <li>Legal inquiries: legal@snippetly.com</li>
                  <li>Website: snippetly.com/contact</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
