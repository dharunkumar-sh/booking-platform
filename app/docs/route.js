import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>VibePass API Documentation</title>
      <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      <!-- Google Fonts -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <!-- Swagger UI CSS CDN -->
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
      <style>
        /* Core colors matching VibePass styling */
        :root {
          --bg-color: #050505;
          --panel-bg: #0d0d10;
          --text-main: #f4f4f5;
          --text-muted: #a1a1aa;
          --primary: #f97316;
          --secondary: #ec4899;
          --tertiary: #a855f7;
          --border-color: #1f1f23;
          --card-bg: #141416;
        }

        body {
          background-color: var(--bg-color) !important;
          color: var(--text-main) !important;
          font-family: 'Inter', sans-serif !important;
          margin: 0;
          padding: 0;
        }

        /* Swagger Wrapper Override */
        .swagger-ui {
          background-color: var(--bg-color) !important;
          color: var(--text-main) !important;
          padding-bottom: 50px;
        }

        /* Typography & Headers */
        .swagger-ui .info .title,
        .swagger-ui .info h1,
        .swagger-ui .info h2,
        .swagger-ui .info h3,
        .swagger-ui .info h4,
        .swagger-ui .info h5,
        .swagger-ui h2,
        .swagger-ui h3,
        .swagger-ui h4,
        .swagger-ui h5 {
          color: var(--text-main) !important;
          font-family: 'Inter', sans-serif !important;
        }

        .swagger-ui .info .title {
          background: linear-gradient(90deg, var(--primary), var(--secondary), var(--tertiary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800 !important;
          font-size: 36px !important;
          letter-spacing: -1px;
        }

        .swagger-ui .info p, 
        .swagger-ui .info li,
        .swagger-ui .info td,
        .swagger-ui .info a {
          color: var(--text-muted) !important;
        }

        .swagger-ui .info a {
          text-decoration: underline;
          transition: color 0.2s;
        }
        .swagger-ui .info a:hover {
          color: var(--primary) !important;
        }

        /* Schemes block */
        .swagger-ui .scheme-container {
          background-color: var(--panel-bg) !important;
          box-shadow: none !important;
          border-bottom: 1px solid var(--border-color) !important;
          border-top: 1px solid var(--border-color) !important;
          padding: 20px 0 !important;
        }

        .swagger-ui select {
          background-color: var(--card-bg) !important;
          color: var(--text-main) !important;
          border: 1px solid var(--border-color) !important;
          border-radius: 6px;
          padding: 6px;
        }

        /* Blocks / Operations */
        .swagger-ui .opblock {
          background-color: var(--panel-bg) !important;
          border-color: var(--border-color) !important;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .swagger-ui .opblock .opblock-summary-operation-id,
        .swagger-ui .opblock .opblock-summary-path,
        .swagger-ui .opblock .opblock-summary-description {
          color: var(--text-main) !important;
          font-family: 'Inter', sans-serif !important;
        }

        .swagger-ui .opblock .opblock-summary-path {
          font-weight: 600 !important;
        }

        /* Method Badges */
        .swagger-ui .opblock.opblock-get {
          background-color: rgba(59, 130, 246, 0.04) !important;
          border-color: rgba(59, 130, 246, 0.15) !important;
        }
        .swagger-ui .opblock.opblock-get .opblock-summary-method {
          background-color: #3b82f6 !important;
          color: #fff !important;
          border-radius: 6px;
        }
        .swagger-ui .opblock.opblock-post {
          background-color: rgba(16, 185, 129, 0.04) !important;
          border-color: rgba(16, 185, 129, 0.15) !important;
        }
        .swagger-ui .opblock.opblock-post .opblock-summary-method {
          background-color: #10b981 !important;
          color: #fff !important;
          border-radius: 6px;
        }
        .swagger-ui .opblock.opblock-delete {
          background-color: rgba(239, 68, 68, 0.04) !important;
          border-color: rgba(239, 68, 68, 0.15) !important;
        }
        .swagger-ui .opblock.opblock-delete .opblock-summary-method {
          background-color: #ef4444 !important;
          color: #fff !important;
          border-radius: 6px;
        }

        /* Model / Schemas section */
        .swagger-ui section.models {
          border-color: var(--border-color) !important;
          background-color: var(--panel-bg) !important;
          border-radius: 12px;
        }
        .swagger-ui section.models .model-container {
          background-color: var(--card-bg) !important;
          border-radius: 8px;
          margin: 10px 0;
          border: 1px solid var(--border-color);
        }
        .swagger-ui section.models h4 span {
          color: var(--text-main) !important;
        }

        .swagger-ui .model-box {
          background-color: var(--bg-color) !important;
          color: var(--text-main) !important;
        }

        /* Tables & Fields */
        .swagger-ui table thead tr td,
        .swagger-ui table thead tr th {
          color: var(--text-main) !important;
          border-bottom: 1px solid var(--border-color) !important;
          font-family: 'Inter', sans-serif !important;
        }

        .swagger-ui .parameter__name,
        .swagger-ui .parameter__type {
          color: var(--text-main) !important;
        }

        .swagger-ui .parameter__in,
        .swagger-ui .parameter__extension {
          color: var(--text-muted) !important;
        }

        /* Highlight Block */
        .swagger-ui .microlight {
          background-color: #0a0a0c !important;
          color: #a78bfa !important;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .swagger-ui .response-col_status {
          color: var(--text-main) !important;
        }

        /* Try It Out Form elements */
        .swagger-ui input[type=text],
        .swagger-ui textarea {
          background-color: var(--card-bg) !important;
          color: var(--text-main) !important;
          border: 1px solid var(--border-color) !important;
          border-radius: 6px;
          padding: 8px;
        }

        .swagger-ui .tabli button.tablinks {
          color: var(--text-muted) !important;
        }
        .swagger-ui .tabli.active button.tablinks {
          color: var(--primary) !important;
          font-weight: bold;
        }

        /* Buttons styling */
        .swagger-ui .btn {
          background-color: var(--card-bg) !important;
          color: var(--text-main) !important;
          border: 1px solid var(--border-color) !important;
          border-radius: 6px;
          transition: all 0.2s ease;
          padding: 6px 16px;
        }

        .swagger-ui .btn:hover {
          background-color: var(--primary) !important;
          color: #fff !important;
          border-color: var(--primary) !important;
        }

        .swagger-ui .btn.execute {
          background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
          color: white !important;
          border: none !important;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(249, 115, 22, 0.2);
        }

        .swagger-ui .btn.execute:hover {
          opacity: 0.9 !important;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.4);
        }

        .swagger-ui .model-title {
          color: var(--text-main) !important;
        }

        .swagger-ui .prop-name {
          color: var(--text-main) !important;
        }

        .swagger-ui .prop-type {
          color: var(--text-muted) !important;
        }

        /* Back to Application Link */
        .back-nav {
          display: flex;
          align-items: center;
          background-color: #0d0d10;
          padding: 12px 40px;
          border-bottom: 1px solid #1f1f23;
        }
        .back-nav a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          transition: color 0.2s;
        }
        .back-nav a:hover {
          color: #fff;
        }
        .back-nav a svg {
          margin-right: 8px;
        }

        /* Scrollbar customization */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: var(--bg-color);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }
      </style>
    </head>
    <body>
      <div class="back-nav">
        <a href="/">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to VibePass Home
        </a>
      </div>
      <div id="swagger-ui"></div>
      <!-- Swagger UI Bundle Scripts -->
      <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: '/swagger.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
            ],
            layout: "BaseLayout"
          });
        };
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
