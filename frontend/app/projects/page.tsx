import {
  fileUrlFromIncluded,
  processed,
  type JsonApiList,
  type NodeProject,
  type DrupalFile,
  type DrupalMediaImage,
} from "@/lib/jsonapi";

const DRUPAL_BASE =
  process.env.NEXT_PUBLIC_DRUPAL_BASE || "http://portfolio.lndo.site";

type ProjectsResponse = JsonApiList<NodeProject>;

async function getProjects(): Promise<ProjectsResponse> {
  const url =
    `${DRUPAL_BASE}/jsonapi/node/project?` +
    `include=field_project_image.field_media_image&sort=-created`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch projects (${res.status})`);
  return res.json();
}

export default async function ProjectsPage() {
  const json = await getProjects();

  return (
    <main className="p-8 space-y-8">
      <h1 className="text-4xl font-bold">Projects</h1>

      {(!json.data || json.data.length === 0) && (
        <p className="text-gray-300">No projects yet.</p>
      )}

      <ul className="grid gap-6 md:grid-cols-2">
        {json.data?.map((node) => {
          const title = node.attributes.title;
          const bodyHtml = processed(node.attributes.field_body);
          const mediaId = node.relationships?.field_project_image?.data?.id;

          const imgUrl = fileUrlFromIncluded(
            json.included as (DrupalFile | DrupalMediaImage)[] | undefined,
            mediaId
          );

          return (
            <li
              key={node.id}
              className="border rounded-xl overflow-hidden bg-black/5"
            >
              {imgUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imgUrl}
                  alt={title}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-5 space-y-3">
                <h2 className="text-2xl font-semibold">{title}</h2>
                {bodyHtml && (
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: bodyHtml }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
