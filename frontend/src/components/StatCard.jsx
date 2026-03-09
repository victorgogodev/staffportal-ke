const StatCard = ({ icon, number, label, bg, textColor }) => {
  return (
    <div className={`rounded-xl p-5 flex flex-col items-center justify-center gap-1 ${bg}`}>
      <span className="text-3xl">{icon}</span>
      <span className={`text-3xl font-bold ${textColor}`}>{number}</span>
      <span className={`text-xs font-medium text-center ${textColor} opacity-80`}>{label}</span>
    </div>
  );
}

export default StatCard;