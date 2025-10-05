import { notFound } from "next/navigation";

const DRUPAL_BASE =
  process.env.NEXT_PUBLIC_DRUPAL_BASE ?? "http://portfolio.lndo.site";

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

type JsonApiItem<T> = {
  data: T;
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

type PageProps = {
  params: { id: string };
};

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = params;
  const ITEM_URL = `${DRUPAL_BASE}/jsonapi/node/article/${id}?include=field_image`;

  const res = await fetch(ITEM_URL, { cache: "no-store" });
  if (res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    return (
      <main className="p-8 space-y-6">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="text-red-400">Failed to fetch article.</p>
      </main>
    );
  }

  const { data: node, included }: JsonApiItem<DrupalArticle> = await res.json();

  const title = node.attributes.title;
  const date = formatDate(node.attributes.created);
  const bodyHtml = node.attributes.body?.processed ?? "";

  const fileId = node.relationships?.field_image?.data?.id ?? undefined;
  const imgUrl = fileUrlFromIncluded(included, fileId);

  return (
    <main className="p-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-sm text-gray-400">{date}</p>
      </header>

      {imgUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgUrl}
          alt={title}
          className="w-full h-72 object-cover rounded-2xl"
        />
      )}

      {bodyHtml ? (
        <article
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      ) : (
        <p>No content.</p>
      )}
    </main>
  );
}
