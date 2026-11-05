import { useState } from "react";
import { retryPage } from "../helpers";

type DebugScenario = "error" | "empty" | null;

export default function DebugMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const scenario = params.get("scenario") as DebugScenario;
  const errorApi = params.get("errorApi");
  const delay = params.get("delay") ?? "";

  const updateDebugState = (
    nextScenario: DebugScenario,
    nextDelay = delay,
    nextErrorApi: string | null = errorApi,
  ) => {
    const url = new URL(window.location.href);

    if (nextScenario) {
      url.searchParams.set("scenario", nextScenario);
    } else {
      url.searchParams.delete("scenario");
    }

    if (nextDelay) {
      url.searchParams.set("delay", nextDelay);
    } else {
      url.searchParams.delete("delay");
    }

    if (nextErrorApi) {
      url.searchParams.set("errorApi", nextErrorApi);
    } else {
      url.searchParams.delete("errorApi");
    }

    window.location.assign(url.toString());
  };

  return (
    <aside className="debug-menu">
      <button
        type="button"
        className="debug-menu-toggle"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        Debug
      </button>
      {isOpen && (
        <div className="debug-menu-panel">
          <strong>Test state</strong>
          <button
            type="button"
            onClick={() => updateDebugState("error", delay, null)}
          >
            Error all GET requests
          </button>
          <button
            type="button"
            onClick={() => updateDebugState("empty", delay, null)}
          >
            Empty list responses
          </button>
          <button
            type="button"
            onClick={() => updateDebugState(scenario, "1500")}
          >
            Slow responses (1.5s)
          </button>
          <button type="button" onClick={retryPage}>
            Clear debug state
          </button>
        </div>
      )}
    </aside>
  );
}
