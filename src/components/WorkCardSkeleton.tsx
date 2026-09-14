export default function WorkCardSkeleton() {
  return (
    <div
      className="flex h-full flex-1 animate-pulse flex-col items-start gap-1.5 rounded-3xl bg-bg-secondary p-1.5"
      aria-hidden
    >
      <div className="aspect-7/5 w-full shrink-0 rounded-[20px] bg-bg-tertiary" />
      <div className="flex w-full flex-1 flex-col items-start gap-8 p-2.5">
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex w-full flex-col items-start gap-1.5">
            <div className="h-6 w-6 shrink-0 rounded-full bg-bg-tertiary" />
            <div className="h-5 w-3/4 rounded bg-bg-tertiary" />
            <div className="h-5 w-1/2 rounded bg-bg-tertiary" />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="h-6 w-16 rounded-full bg-bg-tertiary" />
            <div className="h-6 w-24 rounded-full bg-bg-tertiary" />
            <div className="h-6 w-20 rounded-full bg-bg-tertiary" />
          </div>
        </div>
        <div className="mt-auto flex w-full items-center justify-between">
          <div className="h-9 w-24 rounded-lg bg-bg-tertiary" />
        </div>
      </div>
    </div>
  );
}
