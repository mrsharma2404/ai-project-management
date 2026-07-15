import { desc, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { tasks, pods, stories, users } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/status-badge";
import { NewTaskDialog } from "@/components/tasks/new-task-dialog";
import { avatarColor, initials } from "@/lib/avatar-color";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const [allPods, allStories, allUsers, allTasks] = await Promise.all([
    db.query.pods.findMany({ orderBy: [asc(pods.name)] }),
    db.query.stories.findMany({ orderBy: [asc(stories.title)] }),
    db.query.users.findMany({ orderBy: [asc(users.name)] }),
    db.query.tasks.findMany({
      orderBy: [desc(tasks.createdAt)],
      with: { pod: true, story: true, assignee: true },
    }),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground text-sm">
            Track tickets across all pods.
          </p>
        </div>
        <NewTaskDialog pods={allPods} stories={allStories} users={allUsers} />
      </div>

      {allTasks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground text-sm">No tickets yet.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y rounded-lg border">
          {allTasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{task.title}</span>
                  <Badge variant="outline">{task.pod.name}</Badge>
                  {task.story ? (
                    <Badge variant="secondary">{task.story.title}</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-muted-foreground">
                      Unattached
                    </Badge>
                  )}
                  <StatusBadge status={task.status} />
                </div>
                {task.description && (
                  <p className="text-xs text-muted-foreground">
                    {task.description}
                  </p>
                )}
              </div>

              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback
                      className={cn(
                        avatarColor(task.assignee.name),
                        "font-semibold text-white"
                      )}
                    >
                      {initials(task.assignee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignee.name}</span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">Unassigned</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
