import { pods } from "@/lib/data/pods";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function PodsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pods</h1>
        <p className="text-muted-foreground text-sm">
          All pods in the organization.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pods.map((pod) => (
          <Card key={pod.id}>
            <CardHeader>
              <CardTitle>{pod.name}</CardTitle>
              <CardDescription>{pod.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
