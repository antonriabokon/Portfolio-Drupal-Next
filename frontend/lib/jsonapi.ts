export type DrupalFile = {
  type: "file--file";
  id: string;
  attributes: {
    uri: { url: string };
  };
};

export type DrupalMediaImage = {
  type: "media--image";
  id: string;
  relationships?: {
    field_media_image?: {
      data?: { id: string };
    };
  };
};

export type DrupalBody = {
  value?: string;
  processed?: string;
  summary?: string;
};

export type NodeProject = {
  type: "node--project";
  id: string;
  attributes: {
    title: string;
    field_body?: DrupalBody;
  };
  relationships?: {
    field_project_image?: { data?: { id: string } };
  };
};

export type NodePage = {
  type: "node--page";
  id: string;
  attributes: {
    title: string;
    body?: DrupalBody;
  };
  relationships?: {
    field_about_image?: { data?: { id: string } };
  };
};

export type NodeArticle = {
  type: "node--article";
  id: string;
  attributes: {
    title: string;
    created: string;
    body?: DrupalBody;
  };
  relationships?: {
    field_image?: { data?: { id: string } };
  };
};

export type JsonApiList<T> = {
  data: T[];
  included?: (DrupalFile | DrupalMediaImage)[];
};

export function fileUrlFromIncluded(
  included: (DrupalFile | DrupalMediaImage)[] | undefined,
  mediaId?: string
): string | null {
  if (!included || !mediaId) return null;

  const media = included.find(
    (r) => r.type === "media--image" && r.id === mediaId
  ) as DrupalMediaImage | undefined;

  const fileId = media?.relationships?.field_media_image?.data?.id;
  if (!fileId) return null;

  const file = included.find(
    (r) => r.type === "file--file" && r.id === fileId
  ) as DrupalFile | undefined;

  const base = process.env.NEXT_PUBLIC_DRUPAL_BASE ?? "";
  const url = file?.attributes?.uri?.url;
  if (!url) return null;

  return url.startsWith("http") ? url : `${base}${url}`;
}

export function processed(html?: DrupalBody): string {
  return html?.processed ?? "";
}
