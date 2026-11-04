import ProgressBar from "./progress-bar";
import type { Customer } from "../../api/types";
import { getRemainingTransferLimit } from "../../helpers";
import { formatMoney } from "../../lib/format";
import "./right-rail-styling.css";

export default function RightRail({
  customer: { transferredToday, dailyTransferLimit },
}: {
  customer: Customer;
}) {
  const remainingAmt = getRemainingTransferLimit(
    transferredToday,
    dailyTransferLimit,
  );

  return (
    <div className="right-rail">
      <h3> DAILY LIMIT </h3>
      <p>{formatMoney(remainingAmt)} remaining today</p>
      <ProgressBar progress={transferredToday} total={dailyTransferLimit} />
      <p>Resets daily. Applies to all transfers.</p>
    </div>
  );
}
