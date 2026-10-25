'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { submitReview } from '@/app/gabinet/actions'
import { toast } from 'sonner'
import type { ClinicReviewUi } from '@/lib/gabinet/map-reviews'

function opinionsCountLabel(n: number): string {
  if (n === 1) return '1 opinia'
  const mod100 = n % 100
  const mod10 = n % 10
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${n} opinie`
  }
  return `${n} opinii`
}

function formatReviewDate(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })
}

function buildDistribution(reviews: ClinicReviewUi[]) {
  const total = reviews.length
  if (!total) {
    return [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0, percentage: 0 }))
  }
  return [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length
    return { stars, count, percentage: (count / total) * 100 }
  })
}

type ReviewState = {
  ok: boolean
  error?: string
}

export function ReviewsSection({
  reviews,
  clinicId,
  isLoggedIn,
  canReview,
}: {
  reviews: ClinicReviewUi[]
  clinicId: string
  isLoggedIn: boolean
  canReview: boolean
}) {
  const total = reviews.length
  const avg =
    total > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
      : 0
  const distribution = buildDistribution(reviews)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [didHappen, setDidHappen] = useState(false)
  const reviewAction = useMemo(() => submitReview.bind(null, clinicId), [clinicId])
  const [reviewState, runReviewAction, isReviewPending] = useActionState<ReviewState, FormData>(
    reviewAction,
    { ok: false }
  )

  useEffect(() => {
    if (!reviewState?.ok) return
    toast.success('Dziękujemy za opinię!')
    setRating(0)
    setComment('')
    setDidHappen(false)
  }, [reviewState?.ok])

  useEffect(() => {
    if (!reviewState?.error) return
    toast.error(reviewState.error)
  }, [reviewState?.error])

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <p className="text-sm font-medium text-amber-900">
          Byliście u nas? Podzielcie się wrażeniami! Wasza opinia pomaga innym opiekunom znaleźć najlepszą opiekę, a nam – stawać się lepszymi dla Was.
        </p>
      </div>

      {isLoggedIn && canReview ? (
        <form action={runReviewAction} className="rounded-xl bg-white p-6 shadow-sm">
          <input type="hidden" name="rating" value={rating ? String(rating) : ''} />
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-stone-700">Twoja ocena</p>
              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="rounded-md p-1 transition-colors hover:bg-stone-50"
                    aria-label={`Oceń na ${star} gwiazdek`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <textarea
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Napisz swoją opinię o wizycie..."
                className="min-h-28 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none ring-0 placeholder:text-stone-400 focus:border-emerald-300 focus:bg-white"
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-stone-700">
              <input
                type="checkbox"
                name="didHappen"
                checked={didHappen}
                onChange={(e) => setDidHappen(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-200"
              />
              Czy wizyta się odbyła?
            </label>

            <Button
              type="submit"
              disabled={isReviewPending}
              className="w-full bg-emerald-600 py-6 text-base font-semibold hover:bg-emerald-700"
            >
              Dodaj opinię
            </Button>
          </div>
        </form>
      ) : null}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-800">Opinie klientów</h2>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-4xl font-bold text-emerald-700">{avg.toFixed(1)}</span>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(avg)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-stone-500">na podstawie {opinionsCountLabel(total)}</p>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-64">
            {distribution.map((stat) => (
              <div key={stat.stars} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-stone-600">{stat.stars}</span>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-stone-500">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {!total ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-bold text-stone-800">Opinie klientów</h2>
            <p className="mt-3 text-stone-600">Ten gabinet nie ma jeszcze opinii w serwisie.</p>
          </div>
        ) : null}
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar>
                  {review.avatarUrl ? (
                    <AvatarImage src={review.avatarUrl} alt="" />
                  ) : null}
                  <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-stone-800">{review.author}</p>
                  <p className="text-xs text-stone-500">{formatReviewDate(review.createdAt)}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {review.comment?.trim() ? (
              <p className="mt-4 leading-relaxed text-stone-600">{review.comment.trim()}</p>
            ) : (
              <p className="mt-4 text-sm italic text-stone-500">Brak treści opinii.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
