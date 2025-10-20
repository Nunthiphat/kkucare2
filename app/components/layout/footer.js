export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-gray-600 border-t shadow-inner z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 text-center text-sm">
        &copy; {new Date().getFullYear()} KKUCare. All rights reserved.
      </div>
    </footer>
  );
}