import { Megaphone } from "lucide-react";
import {Card} from "../ui/Card";

export default function AnnouncementCard({
  title,
  content,
  author,
  time,
}: {
  title: string;
  content: string;
  author?: string;
  time?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#FBEAA0] rounded-full">
          <Megaphone className="text-[#4a3630]" size={18} />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{title}</h3>
          {author && <p className="text-sm text-gray-600">By {author}</p>}
          <p className="mt-1 text-sm text-gray-600">{content}</p>
          {time && <p className="mt-2 text-xs text-gray-400">{time}</p>}
        </div>
      </div>
    </Card>
  );
}