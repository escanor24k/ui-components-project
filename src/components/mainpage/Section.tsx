import { Separator } from "@/components/ui/Separator";

export function Section({ title, children }: { title: string; children: React.ReactNode }): React.ReactElement {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-(--text)">{title}</h2>
        <Separator className="mt-3" />
      </div>
      {children}
    </section>
  );
}

export function DemoRow({ label, children }: { label: string; children: React.ReactNode }): React.ReactElement {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-(--text-muted)">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
