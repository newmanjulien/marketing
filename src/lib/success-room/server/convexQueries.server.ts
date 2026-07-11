import { api } from '../../../../convex/_generated/api';
import {
  successRoomDescription,
  type SuccessRoomAssetResourceSlug,
  type SuccessRoomRoutedResourceSlug
} from '$lib/success-room/domain/config';
import { createConvexClient } from '$lib/server/convexClient.server';

export const getPublicSuccessRoom = async (roomSlug: string) => {
  const room = await createConvexClient().query(api.successRooms.getPublicRoom, { slug: roomSlug });

  return room ? { ...room, description: successRoomDescription } : null;
};

export const verifySuccessRoomPassword = async (roomSlug: string, password: string) =>
  createConvexClient().mutation(api.successRooms.verifyPassword, {
    slug: roomSlug,
    password,
  });

export const getProtectedSuccessRoomLandingPage = async (roomSlug: string, accessToken: string) =>
  createConvexClient().query(api.successRooms.getLandingPage, {
    slug: roomSlug,
    accessToken,
  });

export const getProtectedSuccessRoomBasePage = async (roomSlug: string, accessToken: string) =>
  createConvexClient().query(api.successRooms.getBasePage, {
    slug: roomSlug,
    accessToken,
  });

export const resolveProtectedSuccessRoomAsset = async (
  roomSlug: string,
  accessToken: string,
  resourceSlug: SuccessRoomAssetResourceSlug,
) =>
  createConvexClient().query(api.successRooms.resolveAssetResource, {
    slug: roomSlug,
    accessToken,
    resourceSlug,
  });

export const getProtectedSuccessRoomResourcePage = async (
  roomSlug: string,
  accessToken: string,
  resourceSlug: SuccessRoomRoutedResourceSlug,
) =>
  createConvexClient().query(api.successRooms.getRoutedResourcePage, {
    slug: roomSlug,
    accessToken,
    resourceSlug,
  });
