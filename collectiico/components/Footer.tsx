export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-100 py-4 md:py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-xs md:text-sm">
          &copy; {new Date().getFullYear()} Collectiico — Protótipo com Next.js
        </p>
      </div>
    </footer>
  );
}