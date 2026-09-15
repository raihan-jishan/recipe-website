export const InfoBadges = ({Icon = Icon, label}) => {
  return (
    <div className="flex items-center gap-1 font-medium font-montserrat">
      <Icon className="w-4 h-4 lg:w-5 lg:h-5  " />
      <span>{label}</span>
    </div>
  );
};
