import TitleSection from '../title-section';
import ReasonList from './reason-list';

const ReasonSection = () => {
  return (
    <section className="flex flex-col items-center gap-6">
      <TitleSection title="Why book with us?" />
      <ReasonList />
    </section>
  );
};

export default ReasonSection;
