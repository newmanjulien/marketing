import type { ParamMatcher } from '@sveltejs/kit';
import {
  isSuccessRoomAssetResourceSlug,
  isSuccessRoomRoutedResourceSlug,
  type SuccessRoomAssetResourceSlug,
  type SuccessRoomRoutedResourceSlug
} from '$lib/success-room/domain/config';

export const match = ((
  param: string
): param is SuccessRoomAssetResourceSlug | SuccessRoomRoutedResourceSlug =>
  isSuccessRoomAssetResourceSlug(param) ||
  isSuccessRoomRoutedResourceSlug(param)) satisfies ParamMatcher;
