import { api } from '../../../../convex/_generated/api';
import {
  successRoomDescription,
  type SuccessRoomRoutedResourceSlug
} from '$lib/success-room/domain/config';
import { convex } from './convexClient.server';

export const getPublicSuccessRoom = async (roomSlug: string) => {
  const room = await convex.query(api.successRooms.getPublicRoom, { slug: roomSlug });

  return room ? { ...room, description: successRoomDescription } : null;
};

export const verifySuccessRoomPassword = async (roomSlug: string, password: string) =>
  convex.mutation(api.successRooms.verifyPassword, {
    slug: roomSlug,
    password,
  });

export const getProtectedSuccessRoomLandingPage = async (roomSlug: string, accessToken: string) =>
  convex.query(api.successRooms.getLandingPage, {
    slug: roomSlug,
    accessToken,
  });

export const getProtectedSuccessRoomResourcePage = async (
  roomSlug: string,
  accessToken: string,
  resourceSlug: SuccessRoomRoutedResourceSlug,
) =>
  convex.query(api.successRooms.getRoutedResourcePage, {
    slug: roomSlug,
    accessToken,
    resourceSlug,
  });
