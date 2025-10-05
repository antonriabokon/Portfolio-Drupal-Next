const DRUPAL_BASE =
  process.env.NEXT_PUBLIC_DRUPAL_BASE ?? "http://portfolio.lndo.site";
const HOME_URL = `${DRUPAL_BASE}/jsonapi/node/page?filter[title]=Home&include=field_hero_image.field_media_image`;

type DrupalFile = {
  type: "file--file";
  id: string;
  attributes: {
    uri: { url: string };
  };
};

type DrupalMediaImage = {
  type: "media--image";
  id: string;
  relationships?: {
    field_media_image?: {
      data?: { id: string };
    };
  };
};

type DrupalPage = {
  type: "node--page";
  id: string;
  attributes: {
    title: string;
    body?: { processed?: string };
  };
  relationships?: {
    field_hero_image?: {
      data?: { id: string };
    };
  };
};

type JsonApiResponse = {
  data: DrupalPage[];
  included?: (DrupalFile | DrupalMediaImage)[];
};

function fileUrlFromIncluded(
  included: (DrupalFile | DrupalMediaImage)[] | undefined,
  mediaId?: string
) {
  if (!included || !mediaId) return null;

  const media = included.find(
    (r) => r.type === "media--image" && r.id === mediaId
  ) as DrupalMediaImage | undefined;

  const fileId = media?.relationships?.field_media_image?.data?.id;
  if (!fileId) return null;

  const file = included.find(
    (r) => r.type === "file--file" && r.id === fileId
  ) as DrupalFile | undefined;

  const url = file?.attributes?.uri?.url;
  return url ? (url.startsWith("http") ? url : `${DRUPAL_BASE}${url}`) : null;
}

export default async function HomePage() {
  const res = await fetch(HOME_URL, { cache: "no-store" });
  if (!res.ok) {
    return (
      <main className="space-y-6">
        <h1 className="text-3xl font-bold">Home</h1>
        <p className="text-red-400">Failed to fetch Home content.</p>
      </main>
    );
  }

  const json: JsonApiResponse = await res.json();
  const node = json.data[0];

  if (!node) {
    return (
      <main className="space-y-6">
        <h1 className="text-3xl font-bold">Home</h1>
        <p>No Home page found in Drupal. Create a Page titled “Home”.</p>
      </main>
    );
  }

  const title = node.attributes.title;
  const bodyHtml = node.attributes.body?.processed ?? "";
  const mediaId = node.relationships?.field_hero_image?.data?.id;
  const imgUrl = fileUrlFromIncluded(json.included, mediaId);

  return (
    <main className="space-y-8">
      {imgUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgUrl}
          alt={title}
          className="w-full h-72 object-cover rounded-2xl"
        />
      )}

      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{title}</h1>
        {bodyHtml && (
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        )}
      </div>
    </main>
  );
}
