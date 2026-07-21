import { v, type Infer } from 'convex/values';

export const maxCustomBenefitLength = 300;

export const customBenefitKey = 'custom-benefit';

export const successRoomBenefitsStateValidator = v.object({
  selectedCardKeys: v.array(v.string()),
  selectedCustomBenefit: v.union(v.string(), v.null()),
  painPointsByBenefitKey: v.record(v.string(), v.string()),
  goalsByBenefitKey: v.record(v.string(), v.string()),
});

export type SuccessRoomBenefitsState = Infer<typeof successRoomBenefitsStateValidator>;

export const createDefaultBenefitsState = (): SuccessRoomBenefitsState => ({
  selectedCardKeys: [],
  selectedCustomBenefit: null,
  painPointsByBenefitKey: {},
  goalsByBenefitKey: {},
});
