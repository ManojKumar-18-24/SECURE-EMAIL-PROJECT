import { Container, Logo, LogoutBtn } from "./index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const authStatus = useSelector((state) => state.status);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "Email", slug: "/add-email", active: authStatus },
    { name: "Groups", slug: "/groups", active: authStatus },
  ];

  return (
    <header className="py-4 bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-200 shadow-md">
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <Logo width="60px" />
            <span className="text-3xl font-extrabold text-gray-800 tracking-wide bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 text-transparent bg-clip-text">
               SECURE MAIL
            </span>
          </Link>

          {/* Navigation Items */}
          <ul className="flex space-x-6 list-none">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="px-6 py-2 text-lg font-medium text-gray-800 bg-white rounded-full shadow-md 
                                hover:bg-gradient-to-r hover:from-blue-300 hover:to-purple-400 hover:text-white transition-all duration-300 transform hover:scale-105"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
