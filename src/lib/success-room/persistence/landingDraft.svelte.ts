import {
  attachSuccessRoomSaveQueueLifecycle,
  createSuccessRoomSaveQueue
} from './saveQueue';
import { getSuccessRoomApiPath } from '../domain/urls';
import type { SuccessRoom } from '../domain/types';

const cloneQuestionAnswers = (questions: SuccessRoom['questions']) =>
  Object.fromEntries(questions.map((question) => [question.id, question.answer]));

const getQuestionVersion = (questions: SuccessRoom['questions']) =>
  questions.map((question) => `${question.id}\u0000${question.answer}`).join('\u0001');

export const createSuccessRoomLandingDraft = (
  getRoom: () => SuccessRoom,
) => {
  const saveQueue = createSuccessRoomSaveQueue();

  let roomSlug = $state('');
  let questionVersion = $state('');
  let serverQuestionAnswers = $state<Record<string, string>>({});
  let questionAnswers = $state<Record<string, string>>({});

  attachSuccessRoomSaveQueueLifecycle(saveQueue);

  const saveQuestionAnswers = (nextQuestionAnswers: Record<string, string>) => {
    saveQueue.schedule(
      'questionAnswers',
      async () => {
        const response = await fetch(getSuccessRoomApiPath(getRoom().slug, 'questions'), {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            answers: nextQuestionAnswers
          })
        });

        if (!response.ok) {
          throw new Error('Success room question answers could not be saved.');
        }
      },
      500
    );
  };

  $effect(() => {
    const room = getRoom();
    const currentRoomSlug = room.slug;
    const currentQuestionVersion = getQuestionVersion(room.questions);

    if (roomSlug !== currentRoomSlug || questionVersion !== currentQuestionVersion) {
      const nextServerQuestionAnswers = cloneQuestionAnswers(room.questions);
      const preserveLocalAnswers = roomSlug === currentRoomSlug;

      roomSlug = currentRoomSlug;
      questionVersion = currentQuestionVersion;
      questionAnswers = Object.fromEntries(
        room.questions.map((question) => {
          const currentAnswer = questionAnswers[question.id];
          const serverAnswer = serverQuestionAnswers[question.id];
          const hasLocalEdit =
            preserveLocalAnswers &&
            serverAnswer !== undefined &&
            currentAnswer !== serverAnswer;

          return [
            question.id,
            hasLocalEdit ? currentAnswer : nextServerQuestionAnswers[question.id] ?? ''
          ];
        })
      );
      serverQuestionAnswers = nextServerQuestionAnswers;
    }
  });

  return {
    get questionAnswers() {
      return questionAnswers;
    },
    setQuestionAnswers(nextQuestionAnswers: Record<string, string>) {
      questionAnswers = { ...nextQuestionAnswers };
      saveQuestionAnswers(questionAnswers);
    }
  };
};
