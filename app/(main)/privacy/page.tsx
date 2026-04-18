export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-foreground px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-xs font-bold tracking-[3px] uppercase mb-3">
            Legal
          </p>
          <h1 className="text-4xl font-extrabold text-background tracking-tight mb-4">
            Privacy policy
          </h1>
          <p className="text-background/60">Last updated: April 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="bg-card border border-border rounded-2xl p-8 space-y-8">
          {[
            {
              title: "Information we collect",
              content:
                "We collect information you provide when creating an account, placing orders, or contacting us. This includes your name, email address, phone number, and delivery address. We also collect information about your orders and browsing activity on our site.",
            },
            {
              title: "How we use your information",
              content:
                "We use your information to process orders, deliver products, send order confirmations and updates, improve our services, and communicate with you about promotions and new arrivals (only if you opt in).",
            },
            {
              title: "Information sharing",
              content:
                "We do not sell your personal information to third parties. We share your information only with delivery partners to fulfill your orders, and with payment processors to handle transactions securely.",
            },
            {
              title: "Data security",
              content:
                "We use industry-standard security measures to protect your data. Passwords are encrypted and never stored in plain text. We use secure HTTPS connections for all data transfers.",
            },
            {
              title: "Your rights",
              content:
                "You have the right to access, update, or delete your personal information at any time. You can update your profile from your account settings or contact us to request deletion of your data.",
            },
            {
              title: "Cookies",
              content:
                "We use cookies to keep you logged in and remember your cart. We do not use tracking cookies for advertising purposes.",
            },
            {
              title: "Contact us",
              content:
                "If you have any questions about our privacy policy or how we handle your data, please contact us at support@rongonsaaj.com",
            },
          ].map(({ title, content }) => (
            <div key={title}>
              <h2 className="text-base font-extrabold text-foreground mb-3">
                {title}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
