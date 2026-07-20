export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export const testimonials = [
  {
    quote: "We adopted Overbase immediately because it's just text messages",
    name: "Alex L'Heureux",
    role: "CEO",
    company: "WSP",
  },
  {
    quote: "Overbase is simple, we just receive text messages",
    name: "Karthik Rao",
    role: "CEO",
    company: "Nielsen",
  },
] as const satisfies readonly Testimonial[];
