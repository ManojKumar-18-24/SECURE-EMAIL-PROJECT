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
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <Logo width="70px" />
              <span className="text-3xl font-extrabold text-gray-800 tracking-wide bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 text-transparent bg-clip-text">
                SECURE EMAIL
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <ul className="flex space-x-6 relative">
            {navItems.map((item) =>
              item.active ? (
                <li
                  key={item.name}
                  className="relative"
                >
                  {item.isDropdown ? (
                    <>
                      <button
                        className="px-8 py-3 text-lg font-medium text-gray-800 bg-white rounded-full shadow-lg 
                                   hover:bg-gradient-to-r hover:from-blue-300 hover:to-purple-400 hover:text-white transition-all duration-300 transform hover:scale-105"
                        style={{ borderRadius: "12px" }} // Ensuring border-radius consistency
                      >
                        {item.name}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => navigate(item.slug)}
                      className="px-8 py-3 text-lg font-medium text-gray-800 bg-white rounded-full shadow-lg 
                                 hover:bg-gradient-to-r hover:from-blue-300 hover:to-purple-400 hover:text-white transition-all duration-300 transform hover:scale-105"
                      style={{ borderRadius: "12px" }} // Matching border-radius
                    >
                      {item.name}
                    </button>
                  )}
                </li>
              ) : null
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
