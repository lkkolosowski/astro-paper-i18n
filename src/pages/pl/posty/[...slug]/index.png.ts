import type { APIRoute } from "astro";
import { type CollectionEntry } from "astro:content";
import { SITE } from "@/config";
import { getLocaleInfo } from "@/i18n/utils";
import { generateOgImageForPost } from "@/utils/generateOgImages";
import { getPath } from "@/utils/getPath";
import { getPostsByLocale } from "@/utils/posts";

export async function getStaticPaths() {
  if (!SITE.dynamicOgImage) {
    return [];
  }

  const posts = await getPostsByLocale("pl");
  const postsWithoutOgImage = posts.filter(({ data }) => !data.ogImage);

  return postsWithoutOgImage.map(post => ({
    params: {
      slug: getPath(post.id, post.filePath, false),
    },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  if (!SITE.dynamicOgImage) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const locale = "pl";

  return new Response(
    await generateOgImageForPost(
      props as CollectionEntry<"blog">,
      locale,
      getLocaleInfo(locale)
    ),
    {
      headers: { "Content-Type": "image/png" },
    }
  );
};
