import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Skeleton } from "@/components/ui/Skeleton";
import { Section } from "./Section";

export function UtilitiesDemo(): React.ReactElement {
  return (
    <Section title="Utilities">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-(--text-muted) mb-3">Skeleton Loader</p>
          <Card className="p-5">
            <div className="flex items-start gap-4">
              <Skeleton className="size-12 rounded-full shrink-0" />
              <div className="flex-1 space-y-2.5">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </Card>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-(--text-muted) mb-3">Separator</p>
          <Card className="p-5 space-y-4">
            <p className="text-sm text-(--text)">Inhalt oben</p>
            <Separator />
            <p className="text-sm text-(--text)">Inhalt unten</p>
            <div className="flex items-center gap-4 h-8">
              <span className="text-sm">Links</span>
              <Separator orientation="vertical" />
              <span className="text-sm">Mitte</span>
              <Separator orientation="vertical" />
              <span className="text-sm">Rechts</span>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
