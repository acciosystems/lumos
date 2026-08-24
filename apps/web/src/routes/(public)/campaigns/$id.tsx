import { createFileRoute, notFound } from '@tanstack/react-router';
import * as v from 'valibot';

import { CampaignDetail } from '@/components/campaign/campaign-detail';
import { Loading } from '@/components/misc/loading';
import { rpc } from '@/lib/rpc';

const paramsSchema = v.object({
  id: v.pipe(v.string(), v.ulid()),
});

export const Route = createFileRoute('/(public)/campaigns/$id')({
  params: {
    parse: (params) => v.parse(paramsSchema, params),
  },
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(
        rpc.campaign.publicById.queryOptions({ input: { id: params.id } }),
      );
    } catch (error) {
      if (isNotFoundError(error)) throw notFound();
      throw error;
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};

    const title = `${loaderData.title} | Nossa Causa`;
    const description = loaderData.description.slice(0, 160);

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        ...(loaderData.imageUrl
          ? [
              { property: 'og:image', content: loaderData.imageUrl },
              { name: 'twitter:card', content: 'summary_large_image' },
              { name: 'twitter:image', content: loaderData.imageUrl },
            ]
          : [{ name: 'twitter:card', content: 'summary' }]),
      ],
    };
  },
  pendingComponent: () => (
    <main className="mx-auto w-full max-w-7xl p-4 sm:px-6 sm:py-6 lg:px-8">
      <Loading description="Carregando campanha" />
    </main>
  ),
  component: PublicCampaignDetailPage,
});

function PublicCampaignDetailPage() {
  const data = Route.useLoaderData();

  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:px-6 sm:py-6 lg:px-8">
      <CampaignDetail campaign={data} />
    </main>
  );
}

function isNotFoundError(error: unknown) {
  return (
    typeof error === 'object' && error !== null && 'code' in error && error.code === 'NOT_FOUND'
  );
}
