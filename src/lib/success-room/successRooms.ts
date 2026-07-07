import type {
  SuccessRoom,
  SuccessRoomMutualSuccessPlanResource,
  SuccessRoomResource
} from './successRoomTypes';

export type SuccessRoomRoutedResourceLink = {
  href: string;
  isRouted: true;
};

export type SuccessRoomDirectResourceLink = {
  href: string;
  target: '_blank';
  rel: 'noopener noreferrer';
  isRouted: false;
};

export type SuccessRoomResourceLink =
  | SuccessRoomRoutedResourceLink
  | SuccessRoomDirectResourceLink;

export const successRooms = [
  {
    slug: 'navacord-k7x4m9p2',
    prospectName: 'Navacord',
    description:
      'Review the shared materials for evaluating Overbase and aligning on a practical proof of concept.',
    team: [
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
      },
      {
        id: 'wendy-taylor',
        name: 'Wendy Taylor',
        role: 'Success',
        imageHref: '/cmos/wendytaylor.png'
      },
      {
        id: 'kate-pennell',
        name: 'Kate Pennell',
        role: 'Advisory',
        imageHref: '/cmos/katepennell.png'
      },
      {
        id: 'john-newell',
        name: 'John Newell',
        role: 'Operations',
        imageHref: '/cmos/johnnewell.png'
      }
    ],
    resources: [
      {
        kind: 'pdf',
        slug: 'sales-deck',
        title: 'Sales deck',
        description: 'Review the Overbase sales deck prepared for Navacord.',
        previewImageHref: '/success-room/navacord-k7x4m9p2/resource-preview.png',
        delivery: {
          type: 'asset',
          href: '/success-room/navacord-k7x4m9p2/sales-deck.pdf'
        }
      },
      {
        kind: 'audio',
        slug: 'audio-summary',
        title: 'Audio summary',
        description: 'Listen to a short summary of Overbase for Navacord.',
        previewImageHref: '/success-room/navacord-k7x4m9p2/resource-preview.png',
        delivery: {
          type: 'asset',
          href: '/success-room/navacord-k7x4m9p2/audio-summary.mp3'
        }
      },
      {
        kind: 'mutual-success-plan',
        slug: 'mutual-success-plan',
        title: 'Mutual success plan',
        description:
          'Align on success criteria, next steps, and owners for a practical proof of concept.',
        previewImageHref: '/success-room/navacord-k7x4m9p2/resource-preview.png',
        delivery: {
          type: 'route'
        }
      }
    ]
  }
] satisfies SuccessRoom[];

export const getSuccessRoomHref = (room: SuccessRoom) => `/success-room/${room.slug}`;

export const getSuccessRoomResourceLink = (
  room: SuccessRoom,
  resource: SuccessRoomResource
): SuccessRoomResourceLink => {
  if (resource.delivery.type === 'asset') {
    return {
      href: resource.delivery.href,
      target: '_blank',
      rel: 'noopener noreferrer',
      isRouted: false
    };
  }

  return {
    href: `${getSuccessRoomHref(room)}/${resource.slug}`,
    isRouted: true
  };
};

export function getSuccessRoom(roomSlug: string): SuccessRoom | undefined {
  return successRooms.find((room) => room.slug === roomSlug);
}

export function getSuccessRoomResource(
  roomSlug: string,
  resourceSlug: string
): { room: SuccessRoom; resource: SuccessRoomResource } | undefined {
  const room = getSuccessRoom(roomSlug);
  const resource = room?.resources.find((item) => item.slug === resourceSlug);

  return room && resource ? { room, resource } : undefined;
}

export function isSuccessRoomRoutedResource(
  resource: SuccessRoomResource
): resource is SuccessRoomMutualSuccessPlanResource {
  return resource.delivery.type === 'route';
}
