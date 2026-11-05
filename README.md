# Meridian Banking — Ailys Tee

- Deployed: https://ailys-tee-dbs-assignment-2026.netlify.app/
- Run locally: `npm install && npm run dev`

## Project structure
- `src/App.tsx`: Loads the customer and account queries, renders the dashboard,
  and controls the transfer modal.
- `src/components/`: Dashboard, header, balance, account, transaction, right
  rail, debug-menu, and transfer-modal UI components.
    - `src/components/transfer-modal/`: Three-step transfer flow, Zod validation,
  field error handling, review, success, and discard confirmation.
- `src/hooks/`: TanStack Query hooks for customer, account, payee, transaction,
  health, and transfer API operations.
- `src/api/`: Typed API client and shared API response types.
- `src/app.test.tsx`: Tests created.

## Decisions and trade-offs
- The header in mobile and desktop view is purposely modified to be different to ensure all buttons are accommodating .
- I added an additional validation so that the user is forced to choose a payee from the existing list, if the user clicks "Continue" without any input.
- Buttons are disabled when certain endpoints are producing an error or pending. Example: User cannot click on "Transfer" button when accounts are not loaded.

## Loading, empty and error states
- Query loading states are shown for the dashboard, accounts, transactions, and
  payees. Query failures show an error message and a `Retry` action where
  applicable.
- Empty transaction searches show `No transactions match your search.` and a
  clear-search action. Empty payee lists show an appropriate empty state.
- Transfer validation errors are shown inline, while send failures use an
  accessible alert and do not show the success screen.
- Open the **Debug** menu in the app to trigger the documented mock API states:
  `?scenario=error`, `?scenario=empty`, and `?delay=1500`. Use **Clear debug
  state** to remove those query parameters and reload the app.

## Tests
The tests in `src/App.test.tsx` cover:

- Dashboard loading from the mock API.
- Transactions loading into the table.
- A transaction search with no results, loading feedback, and clearing the
  search.
- Empty transfer inputs showing inline validation errors.
- Amounts over the available balance being rejected without sending a request.
- Successful transfers showing the success screen and updating the dashboard.
- Dashboard request failures recovering through `Retry`.

Outside of the 3 test cases required and the original dashboard loading test, I have created 3 more tests which focus on user-visible behaviors and the transfer flow.

## AI use
I have used Copilot in creating basic layouts for the header and the modals, generating tests, researching, creating debug menu and modifying the styling for mobile layouts and themes.

In generating the tests, I realised that Copilot had made several mistakes on the flow of creating a transfer, which I have corrected. 

I also edited the balance hiding feature, where it failed to understand that the feature should also apply to account balances, not just total available balance.

Besides that, the initial header created, while fits the requirements, performed badly when the screen is minimised to a smaller size. As such, I had further asked Copilot to fix the header to fit a mobile layout, which it struggled with as it only shrank the size of the texts, styling etc. As such, I have gone on to manually tweak the layout of the header in mobile layout, such that there would be a hamburger menu and the user segment buttons would be shown before the menu. I believe this would better accommodate for user experience.

## Not done / known issues
- Create a reusable component for the search bars for both transactions and payee selections.
- Create a reusable combobox component, instead of just using dropdowns
- Modify the list of transactions to use another layout, instead of table, in mobile view, so the table does not feel shrunk
