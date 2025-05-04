import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdArrowDropdown } from "react-icons/io";
import ImageVie from "../../assets/Flags.png";
import ImageEng from "../../assets/FlagsE.png";
import "./LanguageSwitch.scss";

interface Language {
  name: string;
  image: string;
  code: string;
}

const LanguageSwitch = () => {
  const { i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    name: "ENG",
    image: ImageEng,
    code: "en",
  });

  const languages = [
    { name: "ENG", image: ImageEng, code: "en" },
    { name: "VIE", image: ImageVie, code: "vi" },
  ];

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language.code);
    setDropdownOpen(false);
  };

  return (
    <>
      <div className="dropdown-container">
        <div
          className="dropdown-selected"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <img
            src={selectedLanguage.image}
            alt={selectedLanguage.name}
            className="dropdown-image"
          />
          <span className="dropdown-text">{selectedLanguage.name}</span>
          <IoMdArrowDropdown size={30} />
        </div>
        <ul
          className="dropdown-menu"
          style={{ display: dropdownOpen ? "block" : "none" }}
        >
          {languages.map((language) => (
            <li
              key={language.name}
              className="dropdown-item"
              onClick={() => handleLanguageSelect(language)}
            >
              <img
                src={language.image}
                alt={language.name}
                className="dropdown-image"
              />
              <span className="dropdown-text">{language.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default LanguageSwitch;
