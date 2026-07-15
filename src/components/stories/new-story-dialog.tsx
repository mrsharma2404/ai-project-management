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
type Epic = { id: number; title: string; podId: number };

export function NewStoryDialog({ pods, epics }: { pods: Pod[]; epics: Epic[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [podId, setPodId] = useState<string>("");
  const [epicId, setEpicId] = useState<string>("none");
  const [status, setStatus] = useState("todo");

  const availableEpics = useMemo(
    () => epics.filter((epic) => String(epic.podId) === podId),
    [epics, podId]
  );

  function reset() {
    setTitle("");
    setDescription("");
    setPodId("");
    setEpicId("none");
    setStatus("todo");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !podId) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          podId: Number(podId),
          epicId: epicId === "none" ? null : Number(epicId),
          status,
        }),
      });
      if (!res.ok) throw new Error("Failed to create story");
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
        New Story
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>New Story</DialogTitle>
            <DialogDescription>
              Create a story and optionally attach it to an epic.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="story-title">Title</Label>
            <Input
              id="story-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Autocomplete for search bar"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="story-description">Description</Label>
            <Textarea
              id="story-description"
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
                setEpicId("none");
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
            <Label>Epic</Label>
            <Select value={epicId} onValueChange={(value) => setEpicId(value ?? "none")} disabled={!podId}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={podId ? "Attach to an epic" : "Select a pod first"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No epic (unattached)</SelectItem>
                {availableEpics.map((epic) => (
                  <SelectItem key={epic.id} value={String(epic.id)}>
                    {epic.title}
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
              {submitting ? "Creating..." : "Create Story"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
