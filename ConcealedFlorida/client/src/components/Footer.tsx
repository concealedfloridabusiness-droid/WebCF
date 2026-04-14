import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-400 text-sm">
          <p>© 2025 Concealed Florida | Informational only, not legal or medical advice.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:info@concealedflorida.com" className="hover:text-white transition-colors" data-testid="link-email">
              info@concealedflorida.com
            </a>
            <span>|</span>
            <Link href="/about">
              <a className="hover:text-white transition-colors" data-testid="link-privacy-policy">
                Privacy Policy
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
