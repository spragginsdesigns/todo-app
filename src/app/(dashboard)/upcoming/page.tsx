export default function UpcomingPage() {
  return (
    <div className="mx-auto max-w-2xl">
      {/* Page header - hidden on mobile since MobileHeader shows title */}
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold text-foreground">Upcoming</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tasks with future due dates will appear here.
        </p>
      </div>

      <div className="mt-2 space-y-4 md:mt-6">
        <p className="text-sm text-muted-foreground md:hidden">
          Tasks with future due dates will appear here.
        </p>
      </div>
    </div>
  );
}
