import {
  fileUrlFromIncluded,
  processed,
  type JsonApiList,
  type NodePage,
  type DrupalFile,
  type DrupalMediaImage,
} from "@/lib/jsonapi";

const DRUPAL_BASE =
  process.env.NEXT_PUBLIC_DRUPAL_BASE || "http://portfolio.lndo.site";

type AboutResponse = JsonApiList<NodePage>;

async function getAbout(): Promise<AboutResponse> {
  const url =
    `${DRUPAL_BASE}/jsonapi/node/page?` +
    `filter[title]=About&include=field_about_image.field_media_image`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch About (${res.status})`);
  }
  return res.json();
}

export default async function AboutPage() {
  const json = await getAbout();
  const node = json.data?.[0];

  const title = node?.attributes.title ?? "About";
  const bodyHtml = processed(node?.attributes.body);

  const mediaId = node?.relationships?.field_about_image?.data?.id;
  const imgUrl = fileUrlFromIncluded(
    json.included as (DrupalFile | DrupalMediaImage)[] | undefined,
    mediaId
  );

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-4xl font-bold">{title}</h1>

      {bodyHtml && (
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      )}

      {imgUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgUrl}
          alt="About"
          className="w-full max-w-3xl rounded-lg border border-white/10"
        />
      )}
    </main>
  );
}
