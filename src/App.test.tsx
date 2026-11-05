import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { server } from "./test/setup";

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

describe("starter", () => {
  it("loads the dashboard from the mock API", async () => {
    renderApp();

    expect(await screen.findByText(/Good evening, Ava/i)).toBeInTheDocument();
  });

  it("loads transactions into the table", async () => {
    renderApp();

    expect(
      await screen.findByText("Loading transactions..."),
    ).toBeInTheDocument();
    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(await screen.findByText("FairPrice Finest")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
  });

  it("shows no results while searching and restores transactions after clearing", async () => {
    const user = userEvent.setup();
    renderApp();

    const searchBox = await screen.findByPlaceholderText(
      "Search transactions...",
    );
    await screen.findByText("FairPrice Finest");

    await user.type(searchBox, "no matching transaction");

    expect(
      await screen.findByText("Loading transactions..."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("No transactions match your search."),
    ).toBeInTheDocument();

    const clearSearchButtons = screen.getAllByRole("button", {
      name: "Clear search",
    });
    await user.click(clearSearchButtons[0]);

    expect(await screen.findByText("FairPrice Finest")).toBeInTheDocument();
    expect(
      screen.queryByText("No transactions match your search."),
    ).not.toBeInTheDocument();
  });

  it("shows inline errors for empty required transfer inputs", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByRole("button", { name: "Transfer" }));

    // Choose a recipient.
    await screen.findByRole("radio", { name: /Jamie Tan/i });
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByText("Choose a recipient.")).toBeInTheDocument();

    // 
    await user.click(
      await screen.findByRole("button", { name: /Send to someone new/i }),
    );
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      await screen.findByText(
        "Enter a recipient name between 2 and 50 characters.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter a valid 8-digit account number."),
    ).toBeInTheDocument();
    expect(screen.getByText("Select a bank.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await user.type(screen.getByLabelText("Recipient name"), "Ava Chen");
    await user.type(screen.getByLabelText("Account number"), "12345678");
    await user.selectOptions(screen.getByLabelText("Bank"), "DBS");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(
      await screen.findByText(
        /Enter an amount of at least SGD.*1\.00.*2 decimal places/,
      ),
    ).toBeInTheDocument();
  });

  it("shows an error when sending an amount over balance and sends no request", async () => {
    const user = userEvent.setup();
    const transferRequest = vi.fn();
    server.use(
      http.post("*/api/transfers", async () => {
        transferRequest();
        return HttpResponse.json({}, { status: 500 });
      }),
    );

    renderApp();
    await user.click(await screen.findByRole("button", { name: "Transfer" }));
    await user.click(await screen.findByRole("radio", { name: /Jamie Tan/i }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    const amount = await screen.findByLabelText("Amount");
    await user.clear(amount);
    await user.type(amount, "5000");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      await screen.findByText(/more than your available balance/i),
    ).toBeInTheDocument();
    expect(transferRequest).not.toHaveBeenCalled();
  });

  it("shows success and updates the dashboard after a successful transfer", async () => {
    const user = userEvent.setup();

    renderApp();
    await user.click(await screen.findByRole("button", { name: "Transfer" }));
    await user.click(await screen.findByRole("radio", { name: /Jamie Tan/i }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    const amount = await screen.findByLabelText("Amount");
    await user.clear(amount);
    await user.type(amount, "50");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(
      await screen.findByRole("button", { name: "Confirm transfer" }),
    );

    expect(
      await screen.findByText("Transfer sent", {}, { timeout: 5000 }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back to dashboard" }));

    expect(
      await screen.findByText("Transfer to Jamie Tan"),
    ).toBeInTheDocument();
    expect(screen.getByText(/4,230\.55/)).toBeInTheDocument();
  });

  it("shows a dashboard error and retries the request successfully", async () => {
    let attempts = 0;
    server.use(
      http.get("*/api/customer", async () => {
        attempts += 1;
        if (attempts === 1) {
          return HttpResponse.json(
            {
              error: {
                code: "INTERNAL_ERROR",
                message: "Dashboard unavailable",
              },
            },
            { status: 500 },
          );
        }

        return HttpResponse.json({
          customer: {
            id: "cus_001",
            firstName: "Ava",
            lastName: "Chen",
            email: "ava.chen@example.com",
            segment: "retail",
            dailyTransferLimit: 5000,
            transferredToday: 0,
          },
        });
      }),
    );

    renderApp();

    expect(
      await screen.findByText(/unable to load customer/i),
    ).toBeInTheDocument();
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByText(/Good evening, Ava/i)).toBeInTheDocument();
    expect(attempts).toBe(2);
  });
});
