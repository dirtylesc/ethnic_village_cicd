type TitleSectionProps = {
  title: string;
  description?: string;
}

const TitleSection = ({ title, description }: TitleSectionProps) => {
  return (
    <div className="w-full text-sky-400">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && <p className="text-base">{description}</p>}
    </div>
  );
};

export default TitleSection;
