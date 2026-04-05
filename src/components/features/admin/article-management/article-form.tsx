'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

import 'react-quill/dist/quill.snow.css';

import { ArticleStatus } from '@/core/enum/article.enum';

import { ArticleAdmin, ArticleAdminPayload } from '@/types/article.type';
import { Tag } from '@/types/tag.type';
import { useTagList } from '@/hooks/api/useTag';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type ArticleFormProps = {
  initialData?: ArticleAdmin | null;
  onSubmit: (payload: ArticleAdminPayload) => Promise<void>;
  submitting?: boolean;
};

export function ArticleForm({ initialData, onSubmit, submitting }: ArticleFormProps) {
  const t = useTranslations('admin.article.form');
  const tStatus = useTranslations('admin.status');
  const [form, setForm] = useState<ArticleAdminPayload>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    imageUrl: '',
    status: ArticleStatus.DRAFT,
    publishedDate: null,
    tagIds: [],
  });

  const { data: tagRes } = useTagList();
  const tags = tagRes?.data || [];
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        slug: initialData.slug,
        summary: initialData.summary,
        content: initialData.content,
        imageUrl: initialData.imageUrl,
        status: initialData.status,
        publishedDate: initialData.publishedDate,
        tagIds: initialData.tags?.map(tag => tag.id) || [],
      });
    }
  }, [initialData]);

  const statusOptions = useMemo(
    () =>
      [
        ArticleStatus.DRAFT,
        ArticleStatus.REVIEWING,
        ArticleStatus.REJECTED,
        ArticleStatus.APPROVED,
        ArticleStatus.SCHEDULED,
        ArticleStatus.PUBLISHED,
      ] as ArticleStatus[],
    [],
  );

  const toggleTag = (tagId: string) => {
    setForm(prev => {
      const exists = prev.tagIds?.includes(tagId);
      const nextIds = exists ? prev.tagIds?.filter(id => id !== tagId) : [...(prev.tagIds || []), tagId];
      return { ...prev, tagIds: nextIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (!form.content.trim()) return;
    await onSubmit(form);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setForm(prev => ({ ...prev, imageUrl: result }));
        setUploading(false);
      };
      reader.onerror = () => {
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploading(false);
    }
  };

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
    }),
    [],
  );

  const quillFormats = useMemo(
    () => ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image'],
    [],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('info')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>{t('field_title')}</Label>
              <Input
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder={t('field_title')}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t('field_slug')}</Label>
              <Input
                value={form.slug || ''}
                onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                placeholder={t('field_slug')}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>{t('field_status')}</Label>
              <select
                className="h-10 rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={form.status || ArticleStatus.DRAFT}
                onChange={e => setForm(prev => ({ ...prev, status: e.target.value as ArticleStatus }))}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {tStatus(status)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t('field_thumbnail')}</Label>
              <Input
                value={form.imageUrl || ''}
                onChange={e => setForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
              <div className="flex items-center gap-3">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {uploading && (
                  <span className="text-xs text-muted-foreground">{t('uploading' as any) || 'Đang tải...'}</span>
                )}
              </div>
              {form.imageUrl && (
                <div className="flex flex-col items-start gap-2">
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    className="aspect-video w-full max-w-[400px] rounded-md border object-cover"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
                  >
                    {t('clear_image' as any) || 'Xóa ảnh'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('field_summary')}</Label>
            <Textarea
              value={form.summary || ''}
              rows={3}
              onChange={e => setForm(prev => ({ ...prev, summary: e.target.value }))}
              placeholder={t('field_summary')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('field_content')}</Label>
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={value => setForm(prev => ({ ...prev, content: value }))}
              placeholder={t('field_content')}
              modules={quillModules}
              formats={quillFormats}
              className="quill-editor"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('field_tags')}</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {tags.map((tag: Tag) => (
                <label key={tag.id} className="flex items-center gap-2 rounded-md border p-2">
                  <Checkbox
                    checked={form.tagIds?.includes(tag.id)}
                    onCheckedChange={() => toggleTag(tag.id)}
                    aria-label={tag.name}
                  />
                  <span>{tag.name}</span>
                </label>
              ))}
              {tags.length === 0 && <p className="text-sm text-muted-foreground">{t('not_found')}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? t('saving') : t('save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
