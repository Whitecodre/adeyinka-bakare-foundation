import Link from "next/link";
import type { News } from "@/lib/types/domain.types";
import { formatDateShort } from "@/lib/utils/dates";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface NewsCardProps {
  news: News;
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow overflow-hidden">
      {news.image && (
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-6">
        <div className="text-sm text-gray-500 mb-2">
          {formatDateShort(news.published_at || news.created_at)}
        </div>
        <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
        {news.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-2">{news.excerpt}</p>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link
          href={`/news/${news.slug}`}
          className="text-primary hover:text-primary/80 font-medium"
        >
          Read More →
        </Link>
      </CardFooter>
    </Card>
  );
}
