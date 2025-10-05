import Link from "next/link";

const DRUPAL_BASE =
  process.env.NEXT_PUBLIC_DRUPAL_BASE ?? "http://portfolio.lndo.site";

const LIST_URL = `${DRUPAL_BASE}/jsonapi/node/article?include=field_image&sort=-created`;

type DrupalFile = {
  type: "file--file";
  id: string;
  attributes: {
    uri: { url: string };
    filename?: string;
  };
};

type DrupalArticle = {
  type: "node--article";
  id: string;
  attributes: {
    title: string;
    created: string;
    body?: { processed?: string };
  };
  relationships?: {
    field_image?: {
      data: { id: string } | null;
    };
  };
};

type JsonApiList<T> = {
  data: T[];
  included?: DrupalFile[];
};

function fileUrlFromIncluded(
  included: DrupalFile[] | undefined,
  fileId: string | null | undefined
): string | null {
  if (!included || !fileId) return null;
  const file = included.find((r) => r.type === "file--file" && r.id === fileId);
  const url = file?.attributes?.uri?.url;
  return url ? (url.startsWith("http") ? url : `${DRUPAL_BASE}${url}`) : null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const res = await fetch(LIST_URL, { cache: "no-store" });
  if (!res.ok) {
    return (
      <main className="p-8 space-y-6">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="text-red-400">Failed to fetch articles.</p>
      </main>
    );
  }

  const { data, included }: JsonApiList<DrupalArticle> = await res.json();

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      <ul className="space-y-4">
        {data.map((node) => {
          const title = node.attributes.title;
          const date = formatDate(node.attributes.created);

          const fileId = node.relationships?.field_image?.data?.id ?? undefined;
          const imgUrl = fileUrlFromIncluded(included, fileId);

          return (
            <li key={node.id}>
              <Link
                href={`/blog/${node.id}`}
                className="block border rounded-xl hover:bg-white/5 transition p-4"
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="min-w-0">
                    <h2 className="text-2xl font-semibold truncate">{title}</h2>
                    <span className="text-sm text-gray-400">{date}</span>
                  </div>

                  {imgUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgUrl}
                      alt={title}
                      className="w-32 h-20 object-cover rounded-md shrink-0"
                    />
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
