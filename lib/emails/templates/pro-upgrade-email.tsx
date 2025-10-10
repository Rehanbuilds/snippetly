import type * as React from "react"

interface ProUpgradeEmailProps {
  userName: string
  transactionId: string
  dashboardUrl: string
}

export const ProUpgradeEmail: React.FC<ProUpgradeEmailProps> = ({ userName, transactionId, dashboardUrl }) => (
  <html>
    <head>
      <style>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 30px 0;
          border-bottom: 2px solid #f0f0f0;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #000;
        }
        .content {
          padding: 40px 0;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #000;
          color: #fff !important;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 30px 0;
          border-top: 2px solid #f0f0f0;
          color: #666;
          font-size: 14px;
        }
        .pro-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          margin: 20px 0;
        }
        .feature-list {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .feature-list li {
          margin: 10px 0;
        }
        .transaction-box {
          background: #f0f0f0;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
          font-size: 14px;
        }
      `}</style>
    </head>
    <body>
      <div className="header">
        <div className="logo">Snippetly</div>
      </div>

      <div className="content">
        <h1>Welcome to Snippetly Pro! 🚀</h1>

        <div className="pro-badge">PRO MEMBER</div>

        <p>Hi {userName},</p>

        <p>
          Thank you for upgrading to Snippetly Pro! Your payment has been successfully processed, and your account has
          been upgraded.
        </p>

        <div className="transaction-box">
          <strong>Transaction ID:</strong> {transactionId}
        </div>

        <div className="feature-list">
          <h3>Your Pro features are now active:</h3>
          <ul>
            <li>✨ Unlimited code snippets</li>
            <li>🎨 Advanced syntax highlighting</li>
            <li>📤 Export to multiple formats</li>
            <li>🔒 Priority support</li>
            <li>🚀 Early access to new features</li>
            <li>👥 Collaboration features (coming soon)</li>
          </ul>
        </div>

        <p>Start creating unlimited snippets now!</p>

        <a href={dashboardUrl} className="button">
          Go to Dashboard
        </a>

        <p>
          Questions about your Pro plan? Feel free to reach out to us on{" "}
          <a href="https://x.com/snippetly_xyz">X (Twitter)</a>.
        </p>
      </div>

      <div className="footer">
        <p>© {new Date().getFullYear()} Snippetly. All rights reserved.</p>
        <p>
          <a href="https://snippetly.xyz/privacy-policy">Privacy Policy</a> |
          <a href="https://snippetly.xyz/terms-of-service"> Terms of Service</a>
        </p>
      </div>
    </body>
  </html>
)
