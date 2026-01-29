import { useTranslation } from "react-i18next";

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  
  const onSelectLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("lang", language);
  };

  const isSelected = (lang) => {
    if (lang === "tr") return currentLang === "tr" || currentLang?.startsWith("tr");
    return currentLang === "en" || currentLang?.startsWith("en") || (!currentLang?.startsWith("tr"));
  };

  return (
    <div className="d-flex align-items-center gap-2 p-1 rounded-pill" style={{ backgroundColor: "rgba(139, 69, 19, 0.1)" }}>
      <button
        onClick={() => onSelectLanguage("tr")}
        className="btn btn-sm p-0 d-flex align-items-center justify-content-center"
        style={{ 
          width: "36px",
          height: "28px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: isSelected("tr") ? "#8B4513" : "transparent",
          boxShadow: isSelected("tr") ? "0 2px 8px rgba(139, 69, 19, 0.4)" : "none",
          transition: "all 0.2s ease"
        }}
        title="Türkçe"
      >
        <img
          src="https://flagcdn.com/28x21/tr.png"
          width="26"
          height="20"
          alt="Türkçe"
          style={{ 
            borderRadius: "3px",
            opacity: isSelected("tr") ? 1 : 0.6,
            filter: isSelected("tr") ? "none" : "grayscale(30%)"
          }}
        />
      </button>
      <button
        onClick={() => onSelectLanguage("en")}
        className="btn btn-sm p-0 d-flex align-items-center justify-content-center"
        style={{ 
          width: "36px",
          height: "28px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: isSelected("en") ? "#8B4513" : "transparent",
          boxShadow: isSelected("en") ? "0 2px 8px rgba(139, 69, 19, 0.4)" : "none",
          transition: "all 0.2s ease"
        }}
        title="English"
      >
        <img
          src="https://flagcdn.com/28x21/gb.png"
          width="26"
          height="20"
          alt="English"
          style={{ 
            borderRadius: "3px",
            opacity: isSelected("en") ? 1 : 0.6,
            filter: isSelected("en") ? "none" : "grayscale(30%)"
          }}
        />
      </button>
    </div>
  );
}
