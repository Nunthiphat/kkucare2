export default function Footer() {
    return (
      <footer className="bg-gray-100 text-gray-600 mt-10 border-t">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
          &copy; {new Date().getFullYear()} KKUCare. All rights reserved.
        </div>
      </footer>
    );
}