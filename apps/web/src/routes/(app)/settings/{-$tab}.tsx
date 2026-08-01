import { IconShieldLockFilled, IconUserFilled } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import * as v from 'valibot';

import { Loading } from '@/components/misc/loading';
import { AppInset } from '@/components/sidebar/inset';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserConnectedAccounts } from '@/components/user/connected-accounts';
import { UserPasskeys } from '@/components/user/passkeys';
import { UserProfileSettings } from '@/components/user/profile-settings';
import { UserSecuritySettings } from '@/components/user/security-settings';
import { useQuickBreadcrumb, type BreadcrumbLoaderData } from '@/hooks/use-quick-breadcrumb';
import { AuthGuard } from '@/lib/auth/guard';

const paramsSchema = v.object({
  tab: v.optional(v.picklist(['account', 'security'])),
});
type Params = v.InferOutput<typeof paramsSchema>;

const tabMap = {
  account: 'Conta',
  security: 'Segurança',
} satisfies Record<NonNullable<Params['tab']>, string>;

export const Route = createFileRoute('/(app)/settings/{-$tab}')({
  params: {
    parse: (params) => v.parse(paramsSchema, params),
  },
  loader: ({ params }): BreadcrumbLoaderData => {
    const { tab = 'account' } = params;
    return {
      breadcrumb: [{ label: 'Configurações' }, { label: tabMap[tab] }],
    };
  },
  component: SettingsPage,
});

function SettingsPage() {
  const { tab = 'account' } = Route.useParams();
  const navigate = Route.useNavigate();

  const breadcrumbs = useQuickBreadcrumb();

  return (
    <AppInset breadcrumbs={breadcrumbs}>
      <AuthGuard when="loading">
        <Loading description="Verificando autenticação..." />
      </AuthGuard>
      <AuthGuard when="authenticated">
        <Tabs
          value={tab}
          onValueChange={(value) => navigate({ params: { tab: value } })}
          className="space-y-4"
        >
          <TabsList variant="line">
            <TabsTrigger value="account">
              <IconUserFilled /> Conta
            </TabsTrigger>
            <TabsTrigger value="security">
              <IconShieldLockFilled /> Segurança
            </TabsTrigger>
          </TabsList>
          <div className="px-1">
            <TabsContent value="account">
              <div className="space-y-4">
                <UserProfileSettings />
                <UserConnectedAccounts />
              </div>
            </TabsContent>
            <TabsContent value="security">
              <div className="space-y-4">
                <UserSecuritySettings />
                <UserPasskeys />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </AuthGuard>
    </AppInset>
  );
}
