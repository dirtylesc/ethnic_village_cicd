import TourEditContent from '@/components/features/admin/tour-management/tour-edit';

export default function TourEditPage({ params }: { params: { id: string } }) {
  return <TourEditContent tourId={params.id} />;
}
