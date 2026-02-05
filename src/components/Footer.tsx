import Link from "next/link";
export default function Footer() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-semibold">Store</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            A modern e-commerce platform built with Next.js.
          </p>
        </div>

        {/* Store */}
        <div>
          <h4 className="text-sm font-semibold">Store</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              {/* <Link href={ROUTES.STORE} className="hover:text-foreground"> */}
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-foreground">
                Products
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="text-sm font-semibold">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/login" className="hover:text-foreground">
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-foreground">
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-sm font-semibold">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-foreground">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} Store. All rights reserved.</p>
        <p>Built with ❤️ using Next.js & MongoDB</p>
      </div>
    </div>
  );
}
