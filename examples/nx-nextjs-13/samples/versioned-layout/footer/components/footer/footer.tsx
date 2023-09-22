/* eslint-disable-next-line */
export interface FooterProps {}

export function Footer(props: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold mb-2">Products</h3>
            <ul>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-gray-400 transition duration-300"
                >
                  Product 1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-gray-400 transition duration-300"
                >
                  Product 2
                </a>
              </li>
              {/* Add more product links as needed */}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold mb-2">Content</h3>
            <ul>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-gray-400 transition duration-300"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-gray-400 transition duration-300"
                >
                  Articles
                </a>
              </li>
              {/* Add more content links as needed */}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold mb-2">Community</h3>
            <ul>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-gray-400 transition duration-300"
                >
                  Forums
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-gray-400 transition duration-300"
                >
                  Events
                </a>
              </li>
              {/* Add more community links as needed */}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold mb-2">Legal</h3>
            <ul>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-gray-400 transition duration-300"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-gray-400 transition duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              {/* Add more legal links as needed */}
            </ul>
          </div>
        </div>
        <p className="mt-6">
          &copy; {new Date().getFullYear()} Your Company Name. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
