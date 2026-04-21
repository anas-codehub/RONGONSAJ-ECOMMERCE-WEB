import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Package,
  ShoppingBag,
  Users,
  Tag,
  Image,
  FolderOpen,
  LayoutDashboard,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
      <div className="bg-foreground px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-base font-extrabold text-background">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-extrabold shrink-0">
        {number}
      </div>
      <div>
        <p className="text-sm font-extrabold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function Tip({
  type = "info",
  text,
}: {
  type?: "info" | "warning" | "success";
  text: string;
}) {
  const styles = {
    info: {
      bg: "bg-blue-50 border-blue-200",
      icon: Info,
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-200",
      icon: AlertCircle,
      iconColor: "text-yellow-600",
      textColor: "text-yellow-800",
    },
    success: {
      bg: "bg-green-50 border-green-200",
      icon: CheckCircle,
      iconColor: "text-green-600",
      textColor: "text-green-800",
    },
  };
  const s = styles[type];
  const Icon = s.icon;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${s.bg}`}>
      <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${s.iconColor}`} />
      <p className={`text-sm leading-relaxed ${s.textColor}`}>{text}</p>
    </div>
  );
}

function Field({
  name,
  description,
  required = false,
}: {
  name: string;
  description: string;
  required?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="shrink-0 mt-0.5">
        <span
          className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
            required
              ? "bg-destructive/10 text-destructive"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {required ? "Required" : "Optional"}
        </span>
      </div>
      <div>
        <p className="text-sm font-extrabold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default async function AdminGuidePage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-2">
      {/* Header */}
      <div className="bg-foreground rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-background tracking-tight">
              Admin panel guide
            </h1>
            <p className="text-background/50 text-sm mt-0.5">
              Complete manual for managing Rongonsaaj
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            { label: "Dashboard", href: "/admin" },
            { label: "Products", href: "/admin/products" },
            { label: "Orders", href: "/admin/orders" },
            { label: "Users", href: "/admin/users" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center justify-between bg-background/10 hover:bg-background/20 transition-colors rounded-xl px-4 py-3 text-sm font-bold text-background"
            >
              {label}
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </a>
          ))}
        </div>
      </div>

      {/* Dashboard */}
      <Section title="Dashboard overview" icon={LayoutDashboard}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The dashboard is the first page you see when you log in to the admin
          panel. It gives you a quick overview of your store's performance.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Total revenue",
              desc: "Total money earned from all non-cancelled orders since the store opened.",
            },
            {
              title: "Monthly revenue",
              desc: "Total sales made this calendar month only.",
            },
            {
              title: "Monthly profit",
              desc: "Revenue minus cost prices of items sold this month. This is your actual earnings.",
            },
            {
              title: "Pending orders",
              desc: "Orders placed by customers that have not been processed yet.",
            },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-secondary rounded-xl p-4">
              <p className="text-sm font-extrabold text-foreground mb-1">
                {title}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
        <Tip
          type="info"
          text="The profit calculation uses the Actual Price (cost price) you set when adding products. Make sure to always fill in the actual price accurately for correct profit reports."
        />
      </Section>

      {/* Products */}
      <Section title="Managing products" icon={Package}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Products are the items you sell. You can add, edit, and delete
          products from the Products section.
        </p>

        <h3 className="text-sm font-extrabold text-foreground mt-2">
          How to add a product
        </h3>
        <div className="space-y-3">
          <Step
            number={1}
            title="Go to Products → Add product"
            description="Click the orange 'Add product' button in the top right corner."
          />
          <Step
            number={2}
            title="Fill in product name"
            description="The slug (URL) will be auto-generated from the name. You can edit it if needed."
          />
          <Step
            number={3}
            title="Write a description"
            description="Describe the product clearly. Good descriptions help customers make decisions."
          />
          <Step
            number={4}
            title="Set pricing"
            description="Fill in Actual Price (your cost), Selling Price (what customer pays), and optionally a discount."
          />
          <Step
            number={5}
            title="Set stock quantity"
            description="How many units do you have available? Stock will decrease automatically when orders are placed."
          />
          <Step
            number={6}
            title="Select category"
            description="Choose which category this product belongs to (Male, Female, Couple, Baby, etc.)"
          />
          <Step
            number={7}
            title="Add sizes and colors"
            description="Click the quick-add buttons (S, M, L, XL) or type custom sizes. Same for colors."
          />
          <Step
            number={8}
            title="Upload images"
            description="Click the upload area and select images from your device. They are automatically converted to 800×800 pixels."
          />
          <Step
            number={9}
            title="Featured toggle"
            description="Check 'Feature this product' to show it on the homepage featured section."
          />
          <Step
            number={10}
            title="Save"
            description="Click 'Create product'. The product is now live on the store."
          />
        </div>

        <h3 className="text-sm font-extrabold text-foreground mt-4">
          Pricing fields explained
        </h3>
        <div className="border border-border rounded-xl overflow-hidden">
          <Field
            name="Actual price (৳)"
            description="This is YOUR cost price — what you paid to buy or make the product. This is hidden from customers and used only for profit calculation."
            required
          />
          <Field
            name="Selling price (৳)"
            description="This is what the customer sees and pays before any discount is applied."
            required
          />
          <Field
            name="Discount by % "
            description="Enter a percentage like 10 for 10% off. The customer pays: Selling price minus 10%."
          />
          <Field
            name="Discount by amount (৳)"
            description="Enter a fixed amount like 200. The customer pays: Selling price minus ৳200."
          />
        </div>

        <Tip
          type="warning"
          text="You can only use ONE type of discount — either percentage OR amount. The system will automatically use whichever type you selected."
        />
        <Tip
          type="success"
          text="The profit preview below the pricing fields shows you exactly what the customer pays, what you save, and your profit per unit — live as you type!"
        />

        <h3 className="text-sm font-extrabold text-foreground mt-4">
          Image guidelines
        </h3>
        <div className="bg-secondary rounded-xl p-4 space-y-2">
          <p className="text-sm font-extrabold text-foreground">
            Product images
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            • All images are automatically converted to{" "}
            <span className="font-bold text-foreground">800×800 pixels</span>{" "}
            (square)
            <br />
            • Supported formats: JPG, PNG, WEBP
            <br />
            • Maximum file size: 20MB
            <br />
            • Best practice: Use white or light background for clean display
            <br />• You can upload multiple images — first image is the main
            display image
          </p>
        </div>

        <h3 className="text-sm font-extrabold text-foreground mt-4">
          Product actions
        </h3>
        <div className="space-y-2">
          {[
            {
              icon: Eye,
              label: "View button",
              desc: "Opens the live product page so you can see how it looks to customers.",
            },
            {
              icon: Pencil,
              label: "Edit button",
              desc: "Opens the edit form where you can change any product details.",
            },
            {
              icon: Trash2,
              label: "Delete button",
              desc: "Permanently deletes the product. This cannot be undone. Orders with this product are not affected.",
            },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                <Icon className="h-3.5 w-3.5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-foreground">
                  {label}
                </p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Categories */}
      <Section title="Managing categories" icon={FolderOpen}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Categories organize your products. Each product must belong to a
          category. Categories appear as filter options on the products page.
        </p>
        <div className="space-y-3">
          <Step
            number={1}
            title="Go to Categories → Add category"
            description="Click the orange 'Add category' button."
          />
          <Step
            number={2}
            title="Enter category name"
            description="Example: Male, Female, Couple, Baby, Accessories. The slug is auto-generated."
          />
          <Step
            number={3}
            title="Save"
            description="Click 'Create category'. It immediately appears as a filter option on the store."
          />
        </div>
        <Tip
          type="warning"
          text="You cannot delete a category that has products assigned to it. First move or delete those products, then delete the category."
        />
      </Section>

      {/* Orders */}
      <Section title="Managing orders" icon={ShoppingBag}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Every time a customer places an order, it appears here. You can update
          the order status as you process and deliver it.
        </p>

        <h3 className="text-sm font-extrabold text-foreground">
          Order status flow
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].map(
            (status, i, arr) => (
              <div key={status} className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : status === "PROCESSING"
                        ? "bg-blue-100 text-blue-800"
                        : status === "SHIPPED"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                  }`}
                >
                  {status}
                </span>
                {i < arr.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            ),
          )}
        </div>

        <div className="border border-border rounded-xl overflow-hidden mt-2">
          <Field
            name="PENDING"
            description="Customer has placed the order. You haven't started processing it yet. This is the default status."
          />
          <Field
            name="PROCESSING"
            description="You have received the order and are preparing it (packing, quality check, etc.)"
          />
          <Field
            name="SHIPPED"
            description="The order has been handed to the delivery person and is on its way to the customer."
          />
          <Field
            name="DELIVERED"
            description="The customer has received the order and paid (Cash on Delivery). Order is complete."
          />
          <Field
            name="CANCELLED"
            description="The order has been cancelled. Stock is automatically restored when you cancel."
          />
        </div>

        <h3 className="text-sm font-extrabold text-foreground mt-2">
          How to update order status
        </h3>
        <Step
          number={1}
          title="Find the order"
          description="You can search by customer name, email, or order ID using the search box."
        />
        <Step
          number={2}
          title="Click the status dropdown"
          description="Each order has a status dropdown in the last column. Click it to see all options."
        />
        <Step
          number={3}
          title="Select new status"
          description="Click the new status. It saves automatically — no need to click a save button."
        />

        <Tip
          type="success"
          text="When you change status to CANCELLED, the product stock is automatically restored. For example, if a customer ordered 2 pieces, those 2 pieces go back to your stock."
        />
      </Section>

      {/* Users */}
      <Section title="Managing users" icon={Users}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All registered customers appear here. You can see their order count
          and manage their roles.
        </p>
        <div className="border border-border rounded-xl overflow-hidden">
          <Field
            name="USER role"
            description="Regular customer. Can browse, buy, review products, and manage their own account."
          />
          <Field
            name="ADMIN role"
            description="Has full access to the admin panel. Can manage all products, orders, users, and settings."
          />
        </div>
        <Step
          number={1}
          title="Find the user"
          description="Use the search box to find a user by name or email."
        />
        <Step
          number={2}
          title="Click 'Make admin' or 'Remove admin'"
          description="Click the button in the Actions column to promote or demote the user."
        />
        <Tip
          type="warning"
          text="Be careful when giving someone admin access. Admins can delete products, change orders, and access all business data."
        />
        <Tip
          type="info"
          text="You cannot change your own role. This prevents accidentally locking yourself out of admin access."
        />
      </Section>

      {/* Coupons */}
      <Section title="Managing coupons" icon={Tag}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Create discount codes that customers can enter at checkout to get a
          discount on their order.
        </p>

        <h3 className="text-sm font-extrabold text-foreground">
          How to create a coupon
        </h3>
        <div className="space-y-3">
          <Step
            number={1}
            title="Go to Coupons → Add coupon"
            description="Click the orange 'Add coupon' button."
          />
          <Step
            number={2}
            title="Enter coupon code"
            description="This is what customers type at checkout. Example: WELCOME20, SALE50, EID2026. It will be converted to uppercase automatically."
          />
          <Step
            number={3}
            title="Set discount value"
            description="Enter a number. If percentage, enter 20 for 20% off. If flat amount, enter 200 for ৳200 off."
          />
          <Step
            number={4}
            title="Choose discount type"
            description="Check 'Percentage discount' for % off, or uncheck for flat ৳ amount off."
          />
          <Step
            number={5}
            title="Set expiry date (optional)"
            description="If you want the coupon to expire on a specific date, set it here. Leave empty for no expiry."
          />
          <Step
            number={6}
            title="Active toggle"
            description="Keep 'Active' checked so customers can use it. Uncheck to temporarily disable without deleting."
          />
        </div>

        <div className="bg-secondary rounded-xl p-4 mt-2">
          <p className="text-sm font-extrabold text-foreground mb-2">
            Example coupons
          </p>
          <div className="space-y-2">
            {[
              { code: "WELCOME20", desc: "20% off for new customers" },
              { code: "EID2026", desc: "15% off for Eid celebration" },
              { code: "FLAT100", desc: "৳100 off any order" },
              { code: "SUMMER50", desc: "50% off summer sale" },
            ].map(({ code, desc }) => (
              <div key={code} className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold bg-card border border-border px-3 py-1 rounded-lg">
                  {code}
                </span>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Hero Slides */}
      <Section title="Managing hero slides" icon={Image}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Hero slides are the big banner images at the top of the homepage. They
          auto-slide every 5 seconds. You can add multiple slides to create a
          slideshow.
        </p>

        <h3 className="text-sm font-extrabold text-foreground">
          How to add a slide
        </h3>
        <div className="space-y-3">
          <Step
            number={1}
            title="Go to Hero slides → Add slide"
            description="Click the orange 'Add slide' button."
          />
          <Step
            number={2}
            title="Upload image"
            description="Click the upload area and select your banner image. It will be automatically resized to 1920×600 pixels."
          />
          <Step
            number={3}
            title="Add title"
            description="This is the big heading text shown on the slide. Example: 'New Collection 2026' or 'Summer Sale — Up to 50% Off'"
          />
          <Step
            number={4}
            title="Add subtitle (optional)"
            description="Smaller text below the title. Example: 'Discover our latest arrivals — curated for you'"
          />
          <Step
            number={5}
            title="Add button text (optional)"
            description="Text shown on the button on the slide. Example: 'Shop now' or 'View collection'"
          />
          <Step
            number={6}
            title="Add button link (optional)"
            description="Where the button takes the customer when clicked. See examples below."
          />
          <Step
            number={7}
            title="Set display order"
            description="0 = first slide, 1 = second slide, etc. Lower number appears first."
          />
        </div>

        <h3 className="text-sm font-extrabold text-foreground mt-4">
          Button link examples
        </h3>
        <div className="border border-border rounded-xl overflow-hidden">
          {[
            { link: "/products", desc: "Takes customer to all products page" },
            {
              link: "/products?sort=newest",
              desc: "Takes customer to newest products",
            },
            {
              link: "/products?category=female",
              desc: "Takes customer to Female category",
            },
            {
              link: "/products?category=male",
              desc: "Takes customer to Male category",
            },
            {
              link: "/products?category=baby",
              desc: "Takes customer to Baby category",
            },
            { link: "/sign-up", desc: "Takes customer to registration page" },
          ].map(({ link, desc }) => (
            <div
              key={link}
              className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0"
            >
              <code className="text-xs font-bold bg-secondary px-2 py-1 rounded-lg text-primary shrink-0">
                {link}
              </code>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-extrabold text-foreground mt-4">
          Slide controls
        </h3>
        <div className="space-y-2">
          {[
            {
              icon: EyeOff,
              label: "Hide slide",
              desc: "Temporarily hides the slide from homepage without deleting it. Click the eye icon.",
            },
            {
              icon: Eye,
              label: "Show slide",
              desc: "Makes a hidden slide visible again on the homepage.",
            },
            {
              icon: Trash2,
              label: "Delete slide",
              desc: "Permanently removes the slide. This cannot be undone.",
            },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                <Icon className="h-3.5 w-3.5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-foreground">
                  {label}
                </p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-secondary rounded-xl p-4 mt-2">
          <p className="text-sm font-extrabold text-foreground mb-2">
            Image guidelines for slides
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            • All images are automatically resized to{" "}
            <span className="font-bold text-foreground">1920×600 pixels</span>
            <br />
            • Use landscape/wide images for best results
            <br />
            • Keep important content (face, product, text) in the CENTER of the
            image
            <br />
            • Avoid very dark or very light images — text may be hard to read
            <br />• Supported formats: JPG, PNG, WEBP · Max size: 20MB
          </p>
        </div>

        <Tip
          type="info"
          text="If you don't add a button text and link, no button will appear on the slide — just the image with title and subtitle. This is fine for decorative slides."
        />
      </Section>

      {/* Profit system */}
      <Section title="Understanding profit & pricing" icon={TrendingUp}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Rongonsaaj has a built-in profit tracking system. Here's how it works.
        </p>

        <div className="bg-foreground rounded-2xl p-6 text-center mb-4">
          <p className="text-background/60 text-xs font-bold tracking-widest uppercase mb-2">
            Profit formula
          </p>
          <p className="text-background text-lg font-extrabold">
            Customer pays − Your cost price = Profit
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              label: "Example 1 — No discount",
              items: [
                "Actual price (your cost): ৳800",
                "Selling price: ৳1,500",
                "Customer pays: ৳1,500",
                "Your profit: ৳1,500 − ৳800 = ৳700",
              ],
            },
            {
              label: "Example 2 — With 20% discount",
              items: [
                "Actual price (your cost): ৳800",
                "Selling price: ৳1,500",
                "Discount: 20%",
                "Customer pays: ৳1,500 − 20% = ৳1,200",
                "Your profit: ৳1,200 − ৳800 = ৳400",
              ],
            },
            {
              label: "Example 3 — With ৳200 flat discount",
              items: [
                "Actual price (your cost): ৳800",
                "Selling price: ৳1,500",
                "Discount: ৳200 flat",
                "Customer pays: ৳1,500 − ৳200 = ৳1,300",
                "Your profit: ৳1,300 − ৳800 = ৳500",
              ],
            },
          ].map(({ label, items }) => (
            <div key={label} className="bg-secondary rounded-xl p-4">
              <p className="text-sm font-extrabold text-foreground mb-2">
                {label}
              </p>
              <div className="space-y-1">
                {items.map((item, i) => (
                  <p
                    key={i}
                    className={`text-xs leading-relaxed ${
                      i === items.length - 1
                        ? "font-extrabold text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {i === items.length - 1 ? "→ " : "• "}
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Tip
          type="warning"
          text="If your actual price is higher than what the customer pays (after discount), you will make a loss. The profit preview in the product form will show this in red."
        />
        <Tip
          type="info"
          text="Monthly profit on the dashboard is calculated from all orders placed this calendar month that are not cancelled."
        />
      </Section>

      {/* Quick tips */}
      <Section title="Quick tips & best practices" icon={CheckCircle}>
        <div className="space-y-3">
          {[
            {
              type: "success" as const,
              text: "Always update order status promptly. Customers can see their order status in their account.",
            },
            {
              type: "success" as const,
              text: "Add high-quality product images. Products with good images sell much better.",
            },
            {
              type: "success" as const,
              text: "Keep stock counts accurate. The system auto-decreases stock when orders are placed.",
            },
            {
              type: "success" as const,
              text: "Use featured products wisely — only your best 4-8 products should be featured on the homepage.",
            },
            {
              type: "warning" as const,
              text: "Never delete a category that has products. Always reassign products first.",
            },
            {
              type: "warning" as const,
              text: "Double-check actual prices before saving products. Wrong prices lead to incorrect profit reports.",
            },
            {
              type: "info" as const,
              text: "You can search for products, orders, and users using the search box at the top of each table.",
            },
            {
              type: "info" as const,
              text: "Coupon codes are case-insensitive — WELCOME20 and welcome20 are the same code.",
            },
          ].map((tip, i) => (
            <Tip key={i} type={tip.type} text={tip.text} />
          ))}
        </div>
      </Section>

      {/* Footer */}
      <div className="bg-secondary border border-border rounded-2xl p-6 text-center">
        <p className="text-sm font-extrabold text-foreground mb-1">
          Need more help?
        </p>
        <p className="text-xs text-muted-foreground">
          Contact your developer for technical support or questions about the
          admin panel.
        </p>
      </div>
    </div>
  );
}
