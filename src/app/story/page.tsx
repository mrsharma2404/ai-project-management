import { desc, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { stories, pods, epics } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { NewStoryDialog } from "@/components/stories/new-story-dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const dynamic = "force-dynamic";

export default async function StoryPage() {
  const [allPods, allEpics, allStories] = await Promise.all([
    db.query.pods.findMany({ orderBy: [asc(pods.name)] }),
    db.query.epics.findMany({ orderBy: [asc(epics.title)] }),
    db.query.stories.findMany({
      orderBy: [desc(stories.createdAt)],
      with: { pod: true, epic: true, tasks: true },
    }),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Story</h1>
          <p className="text-muted-foreground text-sm">
            Track stories across all pods.
          </p>
        </div>
        <NewStoryDialog pods={allPods} epics={allEpics} />
      </div>

      {allStories.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground text-sm">No stories yet.</p>
        </div>
      ) : (
        <Accordion className="rounded-lg border">
          {allStories.map((story) => (
            <AccordionItem
              key={story.id}
              value={String(story.id)}
              className="not-last:border-b px-4"
            >
              <AccordionTrigger className="py-3.5 hover:no-underline">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{story.title}</span>
                  <Badge variant="outline">{story.pod.name}</Badge>
                  {story.epic ? (
                    <Badge variant="secondary">{story.epic.title}</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-muted-foreground">
                      Unattached
                    </Badge>
                  )}
                  <StatusBadge status={story.status} />
                  <span className="text-xs font-normal text-muted-foreground">
                    {story.tasks.length} task{story.tasks.length === 1 ? "" : "s"}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  {story.description && (
                    <p className="text-sm text-muted-foreground">
                      {story.description}
                    </p>
                  )}
                  {story.tasks.length > 0 ? (
                    <div className="flex flex-col divide-y">
                      {story.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between gap-3 py-2"
                        >
                          <span className="text-sm">{task.title}</span>
                          <StatusBadge status={task.status} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No tasks attached yet.
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
