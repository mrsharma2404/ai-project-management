import { desc, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { epics, pods } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { NewEpicDialog } from "@/components/epics/new-epic-dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const dynamic = "force-dynamic";

export default async function EpicsPage() {
  const [allPods, allEpics] = await Promise.all([
    db.query.pods.findMany({ orderBy: [asc(pods.name)] }),
    db.query.epics.findMany({
      orderBy: [desc(epics.createdAt)],
      with: { pod: true, stories: true },
    }),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Epics</h1>
          <p className="text-muted-foreground text-sm">
            Track epics across all pods.
          </p>
        </div>
        <NewEpicDialog pods={allPods} />
      </div>

      {allEpics.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground text-sm">No epics yet.</p>
        </div>
      ) : (
        <Accordion className="rounded-lg border">
          {allEpics.map((epic) => (
            <AccordionItem
              key={epic.id}
              value={String(epic.id)}
              className="not-last:border-b px-4"
            >
              <AccordionTrigger className="py-3.5 hover:no-underline">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{epic.title}</span>
                  <Badge variant="outline">{epic.pod.name}</Badge>
                  <StatusBadge status={epic.status} />
                  <span className="text-xs font-normal text-muted-foreground">
                    {epic.stories.length} stor
                    {epic.stories.length === 1 ? "y" : "ies"}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  {epic.description && (
                    <p className="text-sm text-muted-foreground">
                      {epic.description}
                    </p>
                  )}
                  {epic.stories.length > 0 ? (
                    <div className="flex flex-col divide-y">
                      {epic.stories.map((story) => (
                        <div
                          key={story.id}
                          className="flex items-center justify-between gap-3 py-2"
                        >
                          <span className="text-sm">{story.title}</span>
                          <StatusBadge status={story.status} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No stories attached yet.
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
