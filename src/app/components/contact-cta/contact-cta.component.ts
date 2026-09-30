import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Primary conversion affordance: a button-weight email CTA for the end of a
 * page, where intent is highest. The site previously had exactly one contact
 * link anywhere — 12px gray micro-type in the homepage hero — so a visitor who
 * scrolled past the fold had no way to make contact.
 */
@Component({
  selector: 'app-contact-cta',
  standalone: true,
  templateUrl: './contact-cta.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactCtaComponent {
  /** Line above the button. Set per page so the ask fits the context. */
  @Input() lead = 'Have a project that needs design, frontend, or both?';
}
