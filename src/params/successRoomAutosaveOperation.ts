import type { ParamMatcher } from '@sveltejs/kit';
import { isSuccessRoomAutosaveApiOperation } from '$lib/success-room/domain/api';

export const match = isSuccessRoomAutosaveApiOperation satisfies ParamMatcher;
