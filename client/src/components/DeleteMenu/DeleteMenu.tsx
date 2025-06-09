import { useState, useEffect, useRef } from "react";
import './DeleteMenu.css';

interface DeleteMenuProps {
  deleteFunction: () => void;
}

const DeleteMenu: React.FC<DeleteMenuProps> = ({ deleteFunction }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="menu-container" ref={menuRef}>
      <button className="menu-button text-transition" onClick={toggleMenu}>
        ...
      </button>
      {menuOpen && (
        <div className="menu">
          <button
            className="delete-btn delete-hover"
            onClick={() => {
              deleteFunction();
              setMenuOpen(false);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteMenu;