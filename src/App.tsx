import { useCustomer } from "./hooks/customer-hook";
import RightRail from "./components/right-rail/right-rail";
import MainContent from "./components/main-content/main-content";
import { useState } from "react";
import TransferModal from "./components/transfer-modal/transfer-modal";
import { useAccounts } from "./hooks/accounts-hook";
import Header from "./components/header/header";

export default function App() {
  const {
    data: customerData,
    isPending: customerIsPending,
    isError: customerIsError,
    refetch: refetchCustomer,
  } = useCustomer();
  const {
    data: accountsData,
    isPending: accountsIsPending,
    isError: accountsIsError,
    refetch: refetchAccounts,
  } = useAccounts();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  if (customerIsPending || customerIsError) {
    return (
      <div className={`customer-loading-screen`}>
        {customerIsPending && "Loading customer..."}
        {customerIsError && (
          <div className="customer-error-screen">
            Unable to load customer. Please try again later.
          <button type="button" onClick={() => void refetchCustomer()}>
            Retry
          </button>
          </div>
        )}
      </div>
    );
  }

  const customer = customerData.customer;
  const accounts = accountsData?.accounts || [];

  return (
    <div className="starter">
      <div>
        <Header segment={customer.segment} />
        {accountsIsPending || accountsIsError ? (
          <span>
            {accountsIsPending && "Loading accounts..."}
            {accountsIsError &&
              <>
                Unable to load accounts. Please try again later.
                <button type="button" onClick={() => void refetchAccounts()}>
                  Retry
                </button>
              </>}
          </span>
        ) : (
          <div>
            {isTransferModalOpen && (
              <TransferModal
                customer={customer}
                accounts={accounts}
                setIsTransferModalOpen={setIsTransferModalOpen}
              />
            )}

            <main className="starter-main">
              <MainContent
                accounts={accounts}
                customer={customer}
                setIsTransferModalOpen={setIsTransferModalOpen}
              />
              <RightRail customer={customer} />
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
