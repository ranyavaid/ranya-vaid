export type WorkCase = {
  id: string
  href: string
  imageLayers: {
    src: string
    className: string
    alt?: string
  }[]
  backColor: string
  frontColor: string
  frontShadow: string
  tag: string
  title: string
  imageClassName?: string
}

export const FEATURED_CASES: WorkCase[] = [
  {
    id: 'adnet-cards',
    href: '/works/adnet-design-system',
    imageLayers: [
      {
        src: '/Adnet-1.png',
        className: 'adnetOne',
        alt: 'Adnet component set primary card',
      },
      {
        src: '/Adnet-2.png',
        className: 'adnetTwo',
      },
      {
        src: '/Adnet-3.png',
        className: 'adnetThree',
      },
    ],
    backColor: '#b8e6ff',
    frontColor: '#8FD6FF',
    frontShadow: '0 -13px 24px rgba(1, 98, 153, 0.23)',
    tag: 'Design System',
    title: "Reducing 50% Design-to-dev Friction With Adnet's Design System",
  },
  {
    id: 'okr-alignment',
    href: '/works/improving-organizational-hierarchy',
    imageLayers: [
      {
        src: '/ALignment-1.png',
        className: 'alignOne',
        alt: 'OKR alignment primary board',
      },
    ],
    backColor: '#fff3b0',
    frontColor: '#FFE78F',
    frontShadow: '0 -6px 22px rgba(0, 0, 0, 0.12)',
    tag: 'Product Design',
    title: 'Solving disconnected goals through Goal Alignment for 2x faster contribution tracking',
  },
  {
    id: 'ppn',
    href: '/works/ppn',
    imageLayers: [
      {
        src: '/PPN/cover_1.svg',
        className: 'ppnOne',
        alt: 'PPN service discovery primary screen',
      },
    ],
    backColor: '#FFCCF1',
    frontColor: '#FFB2EA',
    frontShadow: '0 -12px 41px rgba(168, 2, 122, 0.26)',
    tag: 'Product Design',
    title:
      'Building Trust in Local Service Discovery Through a 7-Role Hybrid B2B2C Ecosystem',
  },
  {
    id: 'trip-planning',
    href: '/works/trip-planning',
    imageLayers: [
      {
        src: '/trip-planning-1.png',
        className: 'tripOne',
        alt: 'Trip planning primary app screen',
      },
      {
        src: '/trip-planning-2.png',
        className: 'tripTwo',
      },
    ],
    backColor: '#b8e6ff',
    frontColor: '#8FD6FF',
    frontShadow: '0 -13px 24px rgba(1, 98, 153, 0.23)',
    tag: 'Design Exploration',
    title: 'Streamlining Trip Collaboration and Making Planning Frictionless',
  },
]
