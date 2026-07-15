import { userGroups } from "@/lib/data/users";
import { avatarColor, initials } from "@/lib/avatar-color";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

function TaskStat({
  label,
  value,
  barClassName,
}: {
  label: string;
  value: number;
  barClassName: string;
}) {
  return (
    <div className="flex w-24 flex-col gap-1">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{label}</span>
        <span className="font-medium text-foreground">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", barClassName)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-muted-foreground text-sm">
          Team members grouped by pod.
        </p>
      </div>

      <Accordion className="rounded-lg border">
        {userGroups.map((group) => (
          <AccordionItem
            key={group.pod}
            value={group.pod}
            className="not-last:border-b px-4"
          >
            <AccordionTrigger className="py-3.5 hover:no-underline">
              <span className="flex items-baseline gap-2">
                <span className="font-semibold">{group.pod}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {group.members.length} member
                  {group.members.length > 1 ? "s" : ""}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col divide-y">
                {group.members.map((member) => (
                  <div
                    key={member.name}
                    className="flex flex-wrap items-center justify-between gap-4 py-3 first:pt-1"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback
                          className={cn(
                            avatarColor(member.name),
                            "font-semibold text-white"
                          )}
                        >
                          {initials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.position}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <TaskStat
                        label="Completed"
                        value={member.completed}
                        barClassName="bg-emerald-500"
                      />
                      <TaskStat
                        label="WIP"
                        value={member.wip}
                        barClassName="bg-amber-500"
                      />
                      <TaskStat
                        label="Todo"
                        value={member.todo}
                        barClassName="bg-slate-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
