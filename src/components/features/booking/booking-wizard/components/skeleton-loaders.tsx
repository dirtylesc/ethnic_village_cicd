'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export function GuestCountStepSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-6 w-8" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-3">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-6 w-8" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Separator />
            <div className="flex justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-7 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export function ContactInfoStepSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export function GuestInfoStepSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
          <Separator />
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export function ReviewStepSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
              <div className="mt-3 space-y-2 pl-7">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-40" />
              </div>
              {i < 3 && <Separator className="mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Separator />
            <div className="flex justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-7 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}

export function BookingSummaryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <Skeleton className="h-5 w-36" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="ml-6 space-y-1">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-6" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-6" />
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Separator />
          <div className="flex justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProgressIndicatorSkeleton() {
  return (
    <div className="flex items-center justify-between">
      {[1, 2, 3, 4].map((i, index) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
          {index < 3 && <Skeleton className="mx-4 h-0.5 w-16" />}
        </div>
      ))}
    </div>
  );
}
