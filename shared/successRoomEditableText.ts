import { v, type Infer } from 'convex/values';

// What the prospect edits; the backend stores this plus the attachment link.
export const successRoomEditableTextContentValidator = v.object({
  content: v.string(),
  dataSources: v.array(v.string()),
  success: v.object({
    revenueGrowth: v.string(),
    audience: v.string(),
    workflow: v.string(),
  }),
});

export type SuccessRoomEditableTextContent = Infer<typeof successRoomEditableTextContentValidator>;

export const createDefaultEditableTextContent = (): SuccessRoomEditableTextContent => ({
  content: '',
  dataSources: [],
  success: {
    revenueGrowth: '',
    audience: '',
    workflow: '',
  },
});
