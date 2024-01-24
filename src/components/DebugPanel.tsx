import { useEffect, useState } from "react";
import "../../src/styles/debugPanel.css";
import { IoIosSettings, IoMdClose } from "react-icons/io";
import Burner from "./Burner";

interface Burner {
  id: string;
  name: string;
}

export const SidePanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>
        <IoIosSettings size="2em" />
      </button>
      <div className={`side-panel ${isOpen ? "open" : ""}`}>
        <div className="side-panel-element">
          <button className="btn-close" onClick={() => setIsOpen(!isOpen)}>
            <IoMdClose size="2em" />
          </button>
        </div>
        <Burner />
      </div>
    </>
  );
};
