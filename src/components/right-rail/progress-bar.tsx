export default function ProgressBar({
  progress,
  total,
}: {
  progress: number;
  total: number;
}) {
  const percentageUsed = total > 0 ? Math.min((progress / total) * 100, 100) : 0;

  return (
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{ width: `${percentageUsed}%` }}
      >
      </div>
    </div>
  );
}
