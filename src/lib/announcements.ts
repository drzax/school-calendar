export type Announcement = {
	from: string; // The date from which the announcement should be shown (if it hasn't been dismissed)
	to: string; // The date on which the announcement should be removed
	content: string; // The HTML content of the announcement
	id?: string; // Set this to make the announcement dismissable
};

import { getSubscriptionUrl } from '$lib/utils';

export const announcements: Announcement[] = [
	{
		id: 'b60c00b1',
		from: '2022-08-25',
		to: '2022-09-01',
		content: `Some 🐛 bugs have been 💥 squashed. If you subscribed in your calendar software of choice, please <a href="${getSubscriptionUrl()}">re-subscribe</a> to make sure you're getting correct details.`
	}
];
