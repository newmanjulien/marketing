import type { SuccessRoomTeamMember } from './successRoomTypes';

export const successRoomTeam = [
  {
    id: 'julien-newman',
    name: 'Julien Newman',
    role: 'Founder',
    imageHref: '/julien.png'
  },
  {
    id: 'caden-gibson',
    name: 'Caden Gibson',
    role: 'Engineering',
    imageHref: '/caden.png'
  },
  {
    id: 'tim-york',
    name: 'Tim York',
    role: 'Marketing',
    imageHref: '/cmos/timyork.png'
  },
  {
    id: 'chris-wearing',
    name: 'Chris Wearing',
    role: 'Strategy',
    imageHref: '/cmos/chriswearing.png'
  },
  {
    id: 'trish-lilley',
    name: 'Trish Lilley',
    role: 'Growth',
    imageHref: '/cmos/trishlilley.png'
  }
] satisfies SuccessRoomTeamMember[];
