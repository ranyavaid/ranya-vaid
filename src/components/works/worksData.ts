import { publicUrl } from '../../utils/publicUrl'

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
    id: 'okr-alignment',
    href: '/works/improving-organizational-hierarchy',
    imageLayers: [
      {
        src: publicUrl('/ALignment-1.png'),
        className: 'alignOne',
        alt: 'OKR alignment primary board',
      },
    ],
    backColor: '#b8e6ff',
    frontColor: '#8FD6FF',
    frontShadow: '0 -13px 24px rgba(1, 98, 153, 0.23)',
    tag: 'B2B • Feature Development',
    title: 'Making Contribution Tracking 2x Faster With Goal Alignment',
  },
  {
    id: 'ppn',
    href: '/works/ppn',
    imageLayers: [
      {
        src: publicUrl('/PPN/cover_1.svg'),
        className: 'ppnOne',
        alt: 'PPN service discovery primary screen',
      },
    ],
    backColor: '#fff3b0',
    frontColor: '#FFE78F',
    frontShadow: '0 -6px 22px rgba(0, 0, 0, 0.12)',
    tag: 'B2B • B2C • Product Design',
    title:
      'Building Trust in Local Service Discovery Through a 7-Role Hybrid B2B2C Ecosystem',
  },
  {
    id: 'adnet-cards',
    href: '/works/adnet-design-system',
    imageLayers: [
      {
        src: publicUrl('/Adnet-1.png'),
        className: 'adnetOne',
        alt: 'Adnet component set primary card',
      },
      {
        src: publicUrl('/Adnet-2.png'),
        className: 'adnetTwo',
      },
      {
        src: publicUrl('/Adnet-3.png'),
        className: 'adnetThree',
      },
    ],
    backColor: '#FFCCF1',
    frontColor: '#FFB2EA',
    frontShadow: '0 -12px 41px rgba(168, 2, 122, 0.26)',
    tag: 'B2B • Design System',
    title: "Reducing 50% Design-to-dev Friction With Adnet's Design System",
  },
  {
    id: 'trip-planning',
    href: '/works/trip-planning',
    imageLayers: [
      {
        src: publicUrl('/trip-planning-1.png'),
        className: 'tripOne',
        alt: 'Trip planning primary app screen',
      },
      {
        src: publicUrl('/trip-planning-2.png'),
        className: 'tripTwo',
      },
    ],
    backColor: '#b8e6ff',
    frontColor: '#8FD6FF',
    frontShadow: '0 -13px 24px rgba(1, 98, 153, 0.23)',
    tag: 'B2C • Design Exploration',
    title: 'Streamlining Trip Collaboration and Making Planning Frictionless',
  },
]
