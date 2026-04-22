'use client';

import Link from 'next/link';
import {
  LuBot,
  LuChartLine,
  LuGauge,
  LuLayers,
  LuPlus,
  LuShieldCheck,
  LuSparkles,
} from 'react-icons/lu';

import { useI18n } from '@/i18n/I18nProvider';

export default function PublicPage() {
  const { t } = useI18n();
  const landingActionPrimaryClass =
    'btn btn-sm h-9 min-h-9 border transition-colors duration-150 border-primary/45 bg-primary/10 text-primary hover:border-primary/70 hover:bg-primary/20';

  const copy = {
    badge: t('public.landing.badge'),
    heading: t('public.landing.heading'),
    lead: t('public.landing.lead'),
    trustA: t('public.landing.trustA'),
    trustB: t('public.landing.trustB'),
    trustC: t('public.landing.trustC'),
    sectionFlowTitle: t('public.landing.sectionFlowTitle'),
    sectionFlowLead: t('public.landing.sectionFlowLead'),
    flow1Title: t('public.landing.flow1Title'),
    flow1Desc: t('public.landing.flow1Desc'),
    flow2Title: t('public.landing.flow2Title'),
    flow2Desc: t('public.landing.flow2Desc'),
    flow3Title: t('public.landing.flow3Title'),
    flow3Desc: t('public.landing.flow3Desc'),
    sectionAudienceTitle: t('public.landing.sectionAudienceTitle'),
    sectionAudienceLead: t('public.landing.sectionAudienceLead'),
    audience1Title: t('public.landing.audience1Title'),
    audience1Desc: t('public.landing.audience1Desc'),
    audience2Title: t('public.landing.audience2Title'),
    audience2Desc: t('public.landing.audience2Desc'),
    audience3Title: t('public.landing.audience3Title'),
    audience3Desc: t('public.landing.audience3Desc'),
    audience4Title: t('public.landing.audience4Title'),
    audience4Desc: t('public.landing.audience4Desc'),
    sectionFeaturesTitle: t('public.landing.sectionFeaturesTitle'),
    feature1Title: t('public.landing.feature1Title'),
    feature1Desc: t('public.landing.feature1Desc'),
    feature2Title: t('public.landing.feature2Title'),
    feature2Desc: t('public.landing.feature2Desc'),
    feature3Title: t('public.landing.feature3Title'),
    feature3Desc: t('public.landing.feature3Desc'),
    feature4Title: t('public.landing.feature4Title'),
    feature4Desc: t('public.landing.feature4Desc'),
    bottomTitle: t('public.landing.bottomTitle'),
    bottomLead: t('public.landing.bottomLead'),
    bottomCta: t('public.landing.bottomCta'),
  } as const;

  return (
    <>
      <section className='relative isolate min-h-[92svh] overflow-hidden'>
        <div
          aria-hidden
          className='public-hero-bg-layer absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage:
              "image-set(url('/hero-sky.webp') type('image/webp'), url('/hero-sky.png') type('image/png'))",
          }}
        />
        <div aria-hidden className='public-hero-grid absolute inset-0' />
        <div aria-hidden className='public-hero-orb public-hero-orb-one absolute' />
        <div aria-hidden className='public-hero-orb public-hero-orb-two absolute' />
        <div
          aria-hidden
          className='absolute inset-0 bg-gradient-to-b from-base-100/5 via-base-100/40 to-base-100'
        />

        <div className='relative mx-auto flex min-h-[92svh] w-full max-w-7xl items-center px-4 py-20'>
          <div className='max-w-3xl space-y-8'>
            <span className='inline-flex items-center gap-2 rounded-full border border-primary/45 bg-base-100/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary shadow-sm backdrop-blur'>
              <LuSparkles className='h-3.5 w-3.5' />
              {copy.badge}
            </span>

            <h1 className='font-heading text-4xl leading-tight text-base-content md:text-6xl'>
              {copy.heading}
            </h1>

            <p className='max-w-2xl text-base text-base-content/80 md:text-xl'>{copy.lead}</p>

            <div className='grid gap-3 sm:grid-cols-3'>
              <article className='rounded-box border border-base-300/70 bg-base-100/72 p-4 backdrop-blur'>
                <LuChartLine className='mb-2 h-5 w-5 text-primary' aria-hidden />
                <p className='text-sm font-semibold'>{copy.trustA}</p>
              </article>
              <article className='rounded-box border border-base-300/70 bg-base-100/72 p-4 backdrop-blur'>
                <LuLayers className='mb-2 h-5 w-5 text-primary' aria-hidden />
                <p className='text-sm font-semibold'>{copy.trustB}</p>
              </article>
              <article className='rounded-box border border-base-300/70 bg-base-100/72 p-4 backdrop-blur'>
                <LuShieldCheck className='mb-2 h-5 w-5 text-primary' aria-hidden />
                <p className='text-sm font-semibold'>{copy.trustC}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto w-full max-w-7xl px-4 py-14'>
        <div className='grid gap-5 lg:grid-cols-[1.1fr_1fr]'>
          <div className='space-y-3'>
            <h2 className='font-heading text-3xl'>{copy.sectionFlowTitle}</h2>
            <p className='text-base-content/75'>{copy.sectionFlowLead}</p>
          </div>
          <div className='grid gap-3 sm:grid-cols-3 lg:grid-cols-1'>
            <article className='rounded-box border border-base-300/60 bg-base-100/85 p-4 shadow-sm'>
              <p className='text-sm font-semibold'>{copy.flow1Title}</p>
              <p className='mt-2 text-sm text-base-content/70'>{copy.flow1Desc}</p>
            </article>
            <article className='rounded-box border border-base-300/60 bg-base-100/85 p-4 shadow-sm'>
              <p className='text-sm font-semibold'>{copy.flow2Title}</p>
              <p className='mt-2 text-sm text-base-content/70'>{copy.flow2Desc}</p>
            </article>
            <article className='rounded-box border border-base-300/60 bg-base-100/85 p-4 shadow-sm'>
              <p className='text-sm font-semibold'>{copy.flow3Title}</p>
              <p className='mt-2 text-sm text-base-content/70'>{copy.flow3Desc}</p>
            </article>
          </div>
        </div>
      </section>

      <section className='mx-auto w-full max-w-7xl px-4 pb-14'>
        <div className='rounded-box border border-base-300/65 bg-gradient-to-br from-base-100 to-base-200/70 p-6 sm:p-7'>
          <h2 className='font-heading text-3xl'>{copy.sectionAudienceTitle}</h2>
          <p className='mt-2 max-w-3xl text-base-content/75'>{copy.sectionAudienceLead}</p>

          <div className='mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
            <article className='rounded-box border border-base-300/65 bg-base-100/85 p-4'>
              <p className='text-sm font-semibold'>{copy.audience1Title}</p>
              <p className='mt-2 text-sm text-base-content/70'>{copy.audience1Desc}</p>
            </article>
            <article className='rounded-box border border-base-300/65 bg-base-100/85 p-4'>
              <p className='text-sm font-semibold'>{copy.audience2Title}</p>
              <p className='mt-2 text-sm text-base-content/70'>{copy.audience2Desc}</p>
            </article>
            <article className='rounded-box border border-base-300/65 bg-base-100/85 p-4'>
              <p className='text-sm font-semibold'>{copy.audience3Title}</p>
              <p className='mt-2 text-sm text-base-content/70'>{copy.audience3Desc}</p>
            </article>
            <article className='rounded-box border border-base-300/65 bg-base-100/85 p-4'>
              <p className='text-sm font-semibold'>{copy.audience4Title}</p>
              <p className='mt-2 text-sm text-base-content/70'>{copy.audience4Desc}</p>
            </article>
          </div>
        </div>
      </section>

      <section className='mx-auto w-full max-w-7xl px-4 pb-14'>
        <h2 className='font-heading text-3xl'>{copy.sectionFeaturesTitle}</h2>
        <div className='mt-6 grid gap-3 sm:grid-cols-2'>
          <article className='rounded-box border border-base-300/65 bg-base-100/85 p-5'>
            <LuBot className='h-5 w-5 text-primary' aria-hidden />
            <p className='mt-3 text-base font-semibold'>{copy.feature1Title}</p>
            <p className='mt-2 text-sm text-base-content/70'>{copy.feature1Desc}</p>
          </article>
          <article className='rounded-box border border-base-300/65 bg-base-100/85 p-5'>
            <LuChartLine className='h-5 w-5 text-primary' aria-hidden />
            <p className='mt-3 text-base font-semibold'>{copy.feature2Title}</p>
            <p className='mt-2 text-sm text-base-content/70'>{copy.feature2Desc}</p>
          </article>
          <article className='rounded-box border border-base-300/65 bg-base-100/85 p-5'>
            <LuGauge className='h-5 w-5 text-primary' aria-hidden />
            <p className='mt-3 text-base font-semibold'>{copy.feature3Title}</p>
            <p className='mt-2 text-sm text-base-content/70'>{copy.feature3Desc}</p>
          </article>
          <article className='rounded-box border border-base-300/65 bg-base-100/85 p-5'>
            <LuShieldCheck className='h-5 w-5 text-primary' aria-hidden />
            <p className='mt-3 text-base font-semibold'>{copy.feature4Title}</p>
            <p className='mt-2 text-sm text-base-content/70'>{copy.feature4Desc}</p>
          </article>
        </div>
      </section>

      <section className='mx-auto w-full max-w-7xl px-4 pb-16'>
        <div className='rounded-box border-b-[3px] border-secondary/70 bg-gradient-to-br from-primary/70 to-secondary/70 p-px'>
          <div className='rounded-box bg-base-100/85 p-6 sm:p-8'>
            <h2 className='font-heading text-3xl'>{copy.bottomTitle}</h2>
            <p className='mt-3 max-w-3xl text-base-content/75'>{copy.bottomLead}</p>
            <div className='mt-5'>
              <Link href='/auth/register' className={`${landingActionPrimaryClass} gap-2`}>
                <LuPlus className='h-4 w-4' />
                {copy.bottomCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
