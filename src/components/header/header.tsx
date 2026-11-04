import { useEffect, useState } from "react";
import type { Segment } from "../../api/types";
import "./header-styling.css"

export default function Header({ segment }: { segment: Segment }) {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const [currentSegment, setCurrentSegment] = useState<Segment>(() =>
    document.documentElement.dataset.segment === "premium"
      ? "premium"
      : segment,
  );
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("meridian-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.segment = currentSegment;
    localStorage.setItem("meridian-segment", currentSegment);
  }, [currentSegment]);

  const pages = ["Overview", "Cards", "Payments", "Insights"];
  const [currentPage, setCurrentPage] = useState("Overview");

  const appNavigationComponent = (deviceType: "mobile" | "desktop") => (
    <nav
      id="app-navigation"
      className={`app-navigation ${deviceType} ${isNavigationOpen && deviceType === "mobile" ? "is-open" : ""}`}
      aria-label="Main navigation"
    >
      {pages.map((page) => (
        <a
          key={page}
          className={`app-navigation-link  ${page !== "Overview" ? "disabled" : ""} ${currentPage === page ? "active" : ""}`}
          href={currentPage == "Overview" ? "/" : undefined}
          onClick={(e) => {
            e.preventDefault();
            if (page === "Overview") {
              setCurrentPage(page);
            }
            return undefined;
          }}
        >
          {page}
        </a>
      ))}
    </nav>
  );

  const segmentSwitchComponent = (deviceType: "mobile" | "desktop") => (
    <div
      className={`segment-switch ${deviceType}`}
      aria-label="Customer segment"
    >
      <button
        className={`segment-switch-btn-retail ${currentSegment === "retail" ? "active" : ""}`}
        type="button"
        aria-pressed={currentSegment === "retail"}
        onClick={() => setCurrentSegment("retail")}
      >
        Retail
      </button>
      <button
        className={`segment-switch-btn-premium ${currentSegment === "premium" ? "active" : ""}`}
        type="button"
        aria-pressed={currentSegment === "premium"}
        onClick={() => setCurrentSegment("premium")}
      >
        Premium
      </button>
    </div>
  );

  return (
    <header className="app-header">
      <div className="app-header-container">
        <div className="app-header-container-top">
          <a className="app-brand" href="/" aria-label="Meridian overview">
            <span className="app-brand-mark">M</span>
            <strong>Meridian</strong>
          </a>
          {appNavigationComponent("desktop")}

          <div className="app-header-actions">
            {segmentSwitchComponent("desktop")}
            <button
              className="theme-toggle"
              type="button"
              aria-pressed={theme === "dark"}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? "☼" : "☾"}
            </button>
            <button
              className="account-menu"
              type="button"
              aria-label="Account menu"
            >
              AC
            </button>
          </div>
        </div>
        <div className="app-header-container-bottom">
          <button
            className="app-navigation-toggle"
            type="button"
            aria-expanded={isNavigationOpen}
            aria-controls="app-navigation"
            aria-label="Toggle navigation"
            onClick={() => setIsNavigationOpen((isOpen) => !isOpen)}
          >
            {isNavigationOpen ? "×" : "☰"}
            <span>{currentPage}</span>
          </button>
          {appNavigationComponent("mobile")}
          {segmentSwitchComponent("mobile")}
        </div>
      </div>
    </header>
  );
}
