import { LayoutGrid, Rocket, BookOpen, Ticket } from "lucide-react";

import { pods } from "@/lib/data/pods";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pods</h1>
        <p className="text-muted-foreground text-sm">
          Current work across all pods.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pods.map((pod) => (
          <Card key={pod.id} className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <LayoutGrid className="size-4 text-muted-foreground" />
                <CardTitle>{pod.name}</CardTitle>
              </div>
              <CardDescription>{pod.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Rocket className="size-3" />
                  {pod.epics} epics
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <BookOpen className="size-3" />
                  {pod.stories} stories
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Ticket className="size-3" />
                  {pod.tickets} tickets
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
