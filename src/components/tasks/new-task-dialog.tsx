"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { STATUS_OPTIONS } from "@/components/status-badge";

type Pod = { id: number; name: string };
type Story = { id: number; title: string; podId: number };
type User = { id: number; name: string; podId: number | null };

export function NewTaskDialog({
  pods,
  stories,
  users,
}: {
  pods: Pod[];
  stories: Story[];
  users: User[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [podId, setPodId] = useState<string>("");
  const [storyId, setStoryId] = useState<string>("none");
  const [assigneeId, setAssigneeId] = useState<string>("none");
  const [status, setStatus] = useState("todo");

  const availableStories = useMemo(
    () => stories.filter((story) => String(story.podId) === podId),
    [stories, podId]
  );
  const availableUsers = useMemo(
    () => users.filter((user) => String(user.podId) === podId),
    [users, podId]
  );

  function reset() {
    setTitle("");
    setDescription("");
    setPodId("");
    setStoryId("none");
    setAssigneeId("none");
    setStatus("todo");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !podId) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          podId: Number(podId),
          storyId: storyId === "none" ? null : Number(storyId),
          assigneeId: assigneeId === "none" ? null : Number(assigneeId),
          status,
        }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      reset();
      setOpen(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus />
        New Task
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
            <DialogDescription>
              Create a task and optionally attach it to a story.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fix debounce on search input"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Pod</Label>
            <Select
              value={podId}
              onValueChange={(value) => {
                setPodId(value ?? "");
                setStoryId("none");
                setAssigneeId("none");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a pod" />
              </SelectTrigger>
              <SelectContent>
                {pods.map((pod) => (
                  <SelectItem key={pod.id} value={String(pod.id)}>
                    {pod.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Story</Label>
            <Select value={storyId} onValueChange={(value) => setStoryId(value ?? "none")} disabled={!podId}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={podId ? "Attach to a story" : "Select a pod first"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No story (unattached)</SelectItem>
                {availableStories.map((story) => (
                  <SelectItem key={story.id} value={String(story.id)}>
                    {story.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Assignee</Label>
            <Select value={assigneeId} onValueChange={(value) => setAssigneeId(value ?? "none")} disabled={!podId}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={podId ? "Assign to someone" : "Select a pod first"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value ?? "todo")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting || !title.trim() || !podId}>
              {submitting ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
