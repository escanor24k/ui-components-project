import { Grid } from "@/components/ui/Grid";
import { GridItem } from "@/components/ui/GridItem";
import { Section } from "./Section";

const cell =
  "rounded-xl px-4 py-5 text-center text-sm font-medium " +
  "backdrop-blur-xl bg-linear-to-br from-glass/60 via-glass/40 to-glass/20 " +
  "dark:from-glass/8 dark:via-glass/5 dark:to-glass/2 " +
  "border border-glass/50 dark:border-glass/8 text-(--text)";

const accent =
  "rounded-xl px-4 py-5 text-center text-sm font-medium " +
  "bg-primary-500/10 dark:bg-primary-400/8 " +
  "border border-primary-300/30 dark:border-primary-400/15 " +
  "text-primary-700 dark:text-primary-300";

export function GridDemo(): React.ReactElement {
  return (
    <Section title="Grid & GridItem">
      {/* Auto-responsive: 3 columns → 2 on sm → 1 on mobile */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-(--text-muted)">
          Auto-Responsive (3 Spalten)
        </p>
        <Grid columns={3} gap="md">
          <div className={cell}>1</div>
          <div className={cell}>2</div>
          <div className={cell}>3</div>
          <div className={cell}>4</div>
          <div className={cell}>5</div>
          <div className={cell}>6</div>
        </Grid>
      </div>

      {/* Custom responsive breakpoints */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-(--text-muted)">
          Responsive Objekt (1 → 2 → 4)
        </p>
        <Grid columns={{ default: 1, sm: 2, lg: 4 }} gap="lg">
          <div className={cell}>A</div>
          <div className={cell}>B</div>
          <div className={cell}>C</div>
          <div className={cell}>D</div>
        </Grid>
      </div>

      {/* GridItem with colSpan */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-(--text-muted)">
          GridItem – colSpan
        </p>
        <Grid columns={3} gap="md">
          <GridItem colSpan={{ default: 1, sm: 2 }}>
            <div className={accent}>Span 2</div>
          </GridItem>
          <div className={cell}>1</div>
          <div className={cell}>1</div>
          <GridItem colSpan={{ default: 1, sm: 2 }}>
            <div className={accent}>Span 2</div>
          </GridItem>
        </Grid>
      </div>

      {/* 4 columns with rowSpan */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-(--text-muted)">
          4 Spalten + rowSpan
        </p>
        <Grid columns={4} gap="sm">
          <GridItem colSpan={{ default: 1, md: 2 }} rowSpan={2}>
            <div className={`${accent} h-full flex items-center justify-center`}>2×2</div>
          </GridItem>
          <div className={cell}>1</div>
          <div className={cell}>2</div>
          <div className={cell}>3</div>
          <div className={cell}>4</div>
        </Grid>
      </div>
    </Section>
  );
}
