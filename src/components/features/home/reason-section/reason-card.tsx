import Image from 'next/image';

type ReasonCardProps = {
  icon: string;
  title: string;
  description: string;
}

const ReasonCard = ({ icon, title, description }: ReasonCardProps) => {
  return (
    <div className="flex gap-2 rounded-md bg-white p-3 shadow-md">
      <div className="h-16 w-16 flex-shrink-0">
        <Image src={`/images/${icon}`} alt={title} width={64} height={64} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col gap-2 text-dark">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export default ReasonCard;
