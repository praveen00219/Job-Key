import { useState } from "react";
import { Calendar, Paperclip, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { communicationMessages, scheduledInterview } from "@/lib/mockCandidateDetail";

export function CommunicationTab() {
  const [draft, setDraft] = useState("");

  return (
    <div className="rounded-lg bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-heading-sm font-semibold text-grey-950">Communication</h3>
        <Button variant="secondary" size="sm">
          <Calendar className="size-4" />
          Schedule Interview
        </Button>
      </div>

      <div className="mt-5 space-y-4">
        {communicationMessages.map((msg) => {
          if (msg.from === "scheduled") {
            return (
              <div key={msg.id} className="max-w-[420px] rounded-lg border border-grey-200 p-4">
                <p className="flex items-center gap-2 text-body-sm font-semibold text-grey-950">
                  <Calendar className="size-4 text-brand-500" />
                  {scheduledInterview.title}
                </p>
                <dl className="mt-3 space-y-1.5 text-body-sm">
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 text-grey-500">Event</dt>
                    <dd className="text-grey-800">{scheduledInterview.event}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 text-grey-500">Date</dt>
                    <dd className="text-grey-800">{scheduledInterview.date}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 text-grey-500">Time</dt>
                    <dd className="text-grey-800">{scheduledInterview.time}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 text-grey-500">Format</dt>
                    <dd className="text-grey-800">{scheduledInterview.format}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 text-grey-500">Link</dt>
                    <dd className="font-medium text-brand-600">{scheduledInterview.link}</dd>
                  </div>
                </dl>
                <div className="mt-3 flex gap-4 text-body-sm font-medium">
                  <button type="button" className="text-grey-700 hover:text-grey-900">
                    Edit
                  </button>
                  <button type="button" className="text-danger-500 hover:text-danger-600">
                    Cancel Interview
                  </button>
                </div>
              </div>
            );
          }

          const isTeam = msg.from === "team";
          return (
            <div key={msg.id} className={cn("flex flex-col", isTeam ? "items-end" : "items-start")}>
              {isTeam && <p className="mb-1 text-body-xs text-grey-500">{msg.authorName}</p>}
              {!isTeam && <p className="mb-1 text-body-xs text-grey-500">You</p>}
              <div
                className={cn(
                  "max-w-[420px] rounded-lg px-4 py-3 text-body-sm",
                  isTeam ? "bg-grey-950 text-white" : "bg-grey-100 text-grey-800"
                )}
              >
                {msg.body}
              </div>
              <p className="mt-1 text-body-xs text-grey-400">{msg.timestamp}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-md border border-grey-200 px-3 py-2">
        <Paperclip className="size-4 shrink-0 text-grey-400" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-body-sm text-grey-900 placeholder:text-grey-400 focus:outline-none"
        />
        <button type="button" aria-label="Send" className="text-brand-600 hover:text-brand-700">
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
}
