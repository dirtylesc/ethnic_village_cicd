export enum ArticleStatus {
  DRAFT = 'DRAFT',
  REVIEWING = 'REVIEWING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
}

export const ArticleStatusEnum: Record<
  ArticleStatus,
  {
    value: ArticleStatus;
    variant: string;
    label: string;
  }
> = {
  [ArticleStatus.DRAFT]: {
    value: ArticleStatus.DRAFT,
    variant: 'gray',
    label: 'DRAFT',
  },
  [ArticleStatus.REVIEWING]: {
    value: ArticleStatus.REVIEWING,
    variant: 'indigo',
    label: 'REVIEWING',
  },
  [ArticleStatus.REJECTED]: {
    value: ArticleStatus.REJECTED,
    variant: 'red',
    label: 'REJECTED',
  },
  [ArticleStatus.APPROVED]: {
    value: ArticleStatus.APPROVED,
    variant: 'blue',
    label: 'APPROVED',
  },
  [ArticleStatus.SCHEDULED]: {
    value: ArticleStatus.SCHEDULED,
    variant: 'purple',
    label: 'SCHEDULED',
  },
  [ArticleStatus.PUBLISHED]: {
    value: ArticleStatus.PUBLISHED,
    variant: 'teal',
    label: 'PUBLISHED',
  },
};
