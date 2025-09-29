import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SnippetlyLogo } from "@/components/snippetly-logo"

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Welcome to Snippetly ("we," "our," or "us"). We are committed to protecting your privacy and ensuring
                  the security of your personal information. This Privacy Policy explains how we collect, use, disclose,
                  and safeguard your information when you use our code snippet management service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4 className="font-semibold">Personal Information</h4>
                <ul>
                  <li>Email address (required for account creation)</li>
                  <li>Full name and display name (optional)</li>
                  <li>Profile picture/avatar (optional)</li>
                  <li>Bio and profile information (optional)</li>
                </ul>

                <h4 className="font-semibold mt-6">Code Snippets and Content</h4>
                <ul>
                  <li>Code snippets you create, save, and organize</li>
                  <li>Snippet titles, descriptions, and tags</li>
                  <li>Programming languages and categories</li>
                  <li>Favorites and organizational preferences</li>
                </ul>

                <h4 className="font-semibold mt-6">Usage Information</h4>
                <ul>
                  <li>Log data including IP addresses and browser information</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Performance and error data</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>We use the collected information to:</p>
                <ul>
                  <li>Provide and maintain the Snippetly service</li>
                  <li>Authenticate your account and ensure security</li>
                  <li>Store and organize your code snippets</li>
                  <li>Enable search and filtering functionality</li>
                  <li>Improve our service and develop new features</li>
                  <li>Communicate with you about service updates</li>
                  <li>Provide customer support</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Storage and Security</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Your data is stored securely using industry-standard encryption and security practices. We use
                  Supabase as our database provider, which implements enterprise-grade security measures including:
                </p>
                <ul>
                  <li>End-to-end encryption for data in transit and at rest</li>
                  <li>Regular security audits and compliance certifications</li>
                  <li>Row-level security policies to protect your data</li>
                  <li>Automated backups and disaster recovery</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may share your
                  information only in the following circumstances:
                </p>
                <ul>
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations or court orders</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>In connection with a business transfer or acquisition</li>
                  <li>
                    With service providers who assist in operating our platform (under strict confidentiality
                    agreements)
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>You have the following rights regarding your personal information:</p>
                <ul>
                  <li>
                    <strong>Access:</strong> Request a copy of your personal data
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct inaccurate information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account and data
                  </li>
                  <li>
                    <strong>Portability:</strong> Export your code snippets and data
                  </li>
                  <li>
                    <strong>Opt-out:</strong> Unsubscribe from marketing communications
                  </li>
                </ul>
                <p>
                  To exercise these rights, please contact us at privacy@snippetly.com or through your account settings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We use cookies and similar technologies to enhance your experience, maintain your session, and analyze
                  usage patterns. You can control cookie preferences through your browser settings, though some features
                  may not function properly if cookies are disabled.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Snippetly is not intended for children under 13 years of age. We do not knowingly collect personal
                  information from children under 13. If you believe we have collected information from a child under
                  13, please contact us immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by
                  posting the new policy on this page and updating the "Last updated" date. Your continued use of
                  Snippetly after changes become effective constitutes acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <ul>
                  <li>Email: privacy@snippetly.com</li>
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
