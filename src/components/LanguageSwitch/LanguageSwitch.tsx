import { useEffect, useMemo, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import ImageVie from "../../assets/Flags.png";
import ImageEng from "../../assets/FlagsE.png";
import { updateLanguage } from "../../services/userService";
import { UpdateLanguage } from "../../types/Settings";
import "./LanguageSwitch.scss";

interface Language {
  name: string;
  image: string;
  code: string;
}

interface LanguageSwitchProps {
  settingId: string;
  currentLanguage: string;
  onLanguageChange: (langCode: string) => void;
}

const LanguageSwitch = ({
  settingId,
  currentLanguage,
  onLanguageChange,
}: LanguageSwitchProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    name: "ENG",
    image: ImageEng,
    code: "en",
  });

  const languages = useMemo(
    () => [
      { name: "ENG", image: ImageEng, code: "en" },
      { name: "VIE", image: ImageVie, code: "vi" },
    ],
    []
  );

  useEffect(() => {
    const matched = languages.find((lang) => lang.code === currentLanguage);
    if (matched) {
      setSelectedLanguage(matched);
    }
  }, [currentLanguage, languages]);

  const handleLanguageSelect = async (language: Language) => {
    setSelectedLanguage(language);
    onLanguageChange(language.code);
    try {
      const data: UpdateLanguage = { language: language.code };
      await updateLanguage(settingId, data);
    } catch (error) {
      console.log("Error update language", error);
    }
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
