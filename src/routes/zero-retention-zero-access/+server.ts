import { redirect } from '@sveltejs/kit';

export function GET() {
  throw redirect(308, '/pdfs/zero-retention-zero-access.pdf');
}
