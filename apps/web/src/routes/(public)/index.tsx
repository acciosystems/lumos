import {
  IconArrowRight,
  IconCircleCheck,
  IconMapPin,
  IconReceipt,
  IconSend,
  IconUserHeart,
  IconUsers,
} from '@tabler/icons-react';
import { createFileRoute, Link } from '@tanstack/react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { AuthGuard } from '@/lib/auth/guard';

const pageTitle = 'Nossa Causa | Campanhas de doação com transparência';
const pageDescription =
  'Encontre campanhas para doar itens ou contribuir diretamente por PIX e acompanhe participantes, organizadores e prestações de contas.';

export const Route = createFileRoute('/(public)/')({
  head: () => ({
    meta: [
      { title: pageTitle },
      { name: 'description', content: pageDescription },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: pageDescription },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div data-slot="landing-content" className="overflow-hidden">
      <section className="border-b" aria-labelledby="landing-title">
        <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)] lg:px-8 lg:py-20">
          <div className="flex max-w-2xl flex-col items-start gap-6">
            <Badge variant="outline">Doação com transparência</Badge>
            <div className="flex flex-col gap-4">
              <h1
                id="landing-title"
                className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
              >
                Doe para uma causa. Acompanhe o que acontece depois.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Encontre campanhas para entregar itens em pontos de coleta ou contribuir direto com
                o organizador por PIX ou dados bancários.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button nativeButton={false} size="lg" render={<Link to="/campaigns" />}>
                Explorar campanhas <IconArrowRight data-icon="inline-end" aria-hidden />
              </Button>
              <AuthGuard when="authenticated">
                <Button
                  nativeButton={false}
                  size="lg"
                  variant="outline"
                  render={<Link to="/campaigns/new" />}
                >
                  Criar campanha
                </Button>
              </AuthGuard>
              <AuthGuard when="unauthenticated">
                <Button
                  nativeButton={false}
                  size="lg"
                  variant="outline"
                  render={<Link to="/sign-up" />}
                >
                  Criar conta
                </Button>
              </AuthGuard>
            </div>

            <AuthGuard when="unauthenticated">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link to="/sign-in" className="font-medium default-link text-foreground">
                  Entrar
                </Link>
              </p>
            </AuthGuard>
          </div>

          <ParticipationLedger />
        </div>
      </section>

      <section className="bg-muted/40" aria-labelledby="models-title">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading
            eyebrow="Escolha como ajudar"
            title="A contribuição certa para cada causa"
            description="Cada campanha informa com clareza o que precisa, como participar e quem está organizando."
            id="models-title"
          />

          <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
            <CampaignModelCard
              icon={<IconMapPin aria-hidden />}
              label="Campanha física"
              title="Itens entregues em pontos de coleta"
              description="Veja os itens pedidos, o período da campanha e os endereços cadastrados antes de confirmar sua participação."
              details={[
                'Locais e instruções de entrega publicados',
                'Quantidade de participantes visível',
                'Resultado final informado em itens',
              ]}
            />
            <CampaignModelCard
              icon={<IconSend aria-hidden />}
              label="Campanha virtual"
              title="Contribuição enviada direto ao organizador"
              description="Use o PIX ou os dados bancários publicados na campanha. A Nossa Causa não recebe nem processa o pagamento."
              details={[
                'Sem intermediário de pagamento da plataforma',
                'Dados fornecidos pelo próprio organizador',
                'Resultado final informado em reais',
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-y" aria-labelledby="trust-title">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)] lg:gap-16 lg:px-8">
          <SectionHeading
            eyebrow="Transparência do início ao fim"
            title="Confiança não fica para depois"
            description="As informações essenciais continuam públicas durante a campanha e depois que ela termina."
            id="trust-title"
          />

          <ItemGroup className="gap-0 overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10">
            <TrustItem
              number="01"
              icon={<IconUserHeart aria-hidden />}
              title="Saiba quem organiza"
              description="O perfil mostra o nome e o tipo de organizador. Organizações também exibem o CNPJ e seu status de verificação."
            />
            <TrustItem
              number="02"
              icon={<IconUsers aria-hidden />}
              title="Acompanhe a participação"
              description="Campanhas físicas tornam pública a quantidade de pessoas que confirmaram participação."
            />
            <TrustItem
              number="03"
              icon={<IconReceipt aria-hidden />}
              title="Consulte a prestação de contas"
              description="Depois do encerramento, o organizador deve publicar o total alcançado e um resumo do resultado. Evidências também aparecem quando informadas."
            />
          </ItemGroup>
        </div>
      </section>

      <section aria-labelledby="closing-title">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-8 rounded-2xl bg-primary px-6 py-8 text-primary-foreground sm:px-8 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12">
            <div className="flex max-w-2xl flex-col gap-3">
              <p className="text-sm font-medium text-primary-foreground/80">Sua próxima causa</p>
              <h2 id="closing-title" className="font-heading text-3xl font-semibold text-balance">
                Encontre uma campanha e veja exatamente como participar.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                nativeButton={false}
                size="lg"
                variant="secondary"
                render={<Link to="/campaigns" />}
              >
                Ver campanhas <IconArrowRight data-icon="inline-end" aria-hidden />
              </Button>
              <AuthGuard when="authenticated">
                <Button
                  nativeButton={false}
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground shadow-none hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  render={<Link to="/campaigns/new" />}
                >
                  Criar campanha
                </Button>
              </AuthGuard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ParticipationLedger() {
  return (
    <Card className="relative bg-card/95 shadow-lg ring-primary/15">
      <CardHeader className="border-b">
        <CardTitle>Do gesto ao resultado</CardTitle>
        <CardDescription>As duas formas de ajudar seguem para um registro público.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Como funciona</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Item variant="muted" className="items-start">
            <ItemMedia className="rounded-md bg-background p-2 text-primary ring-1 ring-foreground/10">
              <IconMapPin aria-hidden />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Itens no ponto de coleta</ItemTitle>
              <ItemDescription className="line-clamp-none">
                Entregue o que a campanha precisa no local indicado.
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="muted" className="items-start">
            <ItemMedia className="rounded-md bg-background p-2 text-primary ring-1 ring-foreground/10">
              <IconSend aria-hidden />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>PIX direto ao organizador</ItemTitle>
              <ItemDescription className="line-clamp-none">
                Contribua sem passar por um pagamento da plataforma.
              </ItemDescription>
            </ItemContent>
          </Item>
        </div>

        <div
          className="flex items-center gap-3 text-xs font-medium text-muted-foreground"
          aria-hidden
        >
          <div className="h-px flex-1 bg-border" />
          participação pública
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-3 rounded-lg bg-primary/10 p-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <IconReceipt aria-hidden />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-heading font-medium">Resultado publicado após a campanha</p>
            <p className="text-sm text-muted-foreground">
              Total alcançado e resumo do que aconteceu ficam disponíveis para consulta, junto às
              evidências que forem informadas.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CampaignModelCard({
  icon,
  label,
  title,
  description,
  details,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  details: string[];
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex flex-col gap-4 text-lg">
          <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary [&_svg]:size-5">
            {icon}
          </span>
          <span>{title}</span>
        </CardTitle>
        <CardDescription className="leading-relaxed">{description}</CardDescription>
        <CardAction>
          <Badge variant="outline">{label}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2">
          {details.map((detail) => (
            <li key={detail} className="flex items-start gap-2 text-sm">
              <IconCircleCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function TrustItem({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Item
      role="listitem"
      className="grid grid-cols-[1.5rem_2.25rem_minmax(0,1fr)] items-start rounded-none border-0 border-b px-5 py-5 last:border-b-0 sm:px-6"
    >
      <span className="flex h-9 items-center text-xs font-semibold tracking-widest text-primary">
        {number}
      </span>
      <ItemMedia className="size-9 rounded-md bg-primary/10 p-2 text-primary group-has-data-[slot=item-description]/item:translate-y-0 [&_svg]:size-5">
        {icon}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription className="line-clamp-none">{description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: string;
  description: string;
  id: string;
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <p className="text-sm font-medium text-primary">{eyebrow}</p>
      <h2
        id={id}
        className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
      >
        {title}
      </h2>
      <p className="leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
