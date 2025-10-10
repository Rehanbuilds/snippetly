import type * as React from "react"

interface WelcomeEmailProps {
  userName: string
  dashboardUrl: string
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ userName, dashboardUrl }) => (
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
        .feature-list {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .feature-list li {
          margin: 10px 0;
        }
      `}</style>
    </head>
    <body>
      <div className="header">
        <div className="logo">Snippetly</div>
      </div>

      <div className="content">
        <h1>Welcome to Snippetly, {userName}! 🎉</h1>

        <p>
          Thank you for joining Snippetly! We're excited to help you organize and manage your code snippets efficiently.
        </p>

        <div className="feature-list">
          <h3>What you can do with Snippetly:</h3>
          <ul>
            <li>📝 Save and organize up to 50 code snippets (Free plan)</li>
            <li>🔍 Search and filter snippets by language and tags</li>
            <li>💾 Export snippets in multiple formats</li>
            <li>🎨 Syntax highlighting for 50+ languages</li>
            <li>⚡ Quick access to your most-used snippets</li>
          </ul>
        </div>

        <p>Ready to get started?</p>

        <a href={dashboardUrl} className="button">
          Go to Dashboard
        </a>

        <p>
          Need help? Check out our <a href="https://snippetly.xyz/about">About page</a> or reach out to us on{" "}
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
