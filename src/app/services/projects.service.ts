import { Injectable } from '@angular/core';
import { ProjectDetail, HomeCardSection, HomeCardsManifest } from '../models/project.model';

import homeCardsData from '../data/home-cards.json';

import adminData from '../data/admin.json';
import bpmData from '../data/bpm.json';
import contactData from '../data/contact.json';
import earthData from '../data/earth.json';
import emailsData from '../data/emails.json';
import findlawData from '../data/findlaw.json';
import legalData from '../data/legal.json';
import lifeData from '../data/life.json';
import logoData from '../data/logo.json';
import mobileData from '../data/mobile.json';
import modelData from '../data/model.json';
import protoData from '../data/proto.json';
import referenceData from '../data/reference.json';
import reflowData from '../data/reflow.json';
import roughData from '../data/rough.json';
import tremorData from '../data/tremor.json';
import tremorMapsData from '../data/tremor-maps.json';
import tremorSystemData from '../data/tremor-system.json';
import usbData from '../data/usb.json';
import usbMapsData from '../data/usb-maps.json';
import usbSystemData from '../data/usb-system.json';
import usbWireframesData from '../data/usb-wireframes.json';
import utilityData from '../data/utility.json';
import anaJournalData from '../data/ana-journal.json';
import versionSevenData from '../data/version-seven.json';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private projects: Record<string, ProjectDetail> = {
    'ana-journal': anaJournalData as ProjectDetail,
    admin: adminData as ProjectDetail,
    bpm: bpmData as ProjectDetail,
    contact: contactData as ProjectDetail,
    earth: earthData as ProjectDetail,
    emails: emailsData as ProjectDetail,
    findlaw: findlawData as ProjectDetail,
    legal: legalData as ProjectDetail,
    life: lifeData as ProjectDetail,
    logo: logoData as ProjectDetail,
    mobile: mobileData as ProjectDetail,
    model: modelData as ProjectDetail,
    proto: protoData as ProjectDetail,
    reference: referenceData as ProjectDetail,
    reflow: reflowData as ProjectDetail,
    rough: roughData as ProjectDetail,
    tremor: tremorData as ProjectDetail,
    'tremor-maps': tremorMapsData as ProjectDetail,
    'tremor-system': tremorSystemData as ProjectDetail,
    usb: usbData as ProjectDetail,
    'usb-maps': usbMapsData as ProjectDetail,
    'usb-system': usbSystemData as ProjectDetail,
    'usb-wireframes': usbWireframesData as ProjectDetail,
    utility: utilityData as ProjectDetail,
    'version-seven': versionSevenData as ProjectDetail,
  };

  private homeCards: HomeCardsManifest = homeCardsData as HomeCardsManifest;

  getProject(id: string): ProjectDetail | undefined {
    return this.projects[id];
  }

  getHomeCardSections(): HomeCardSection[] {
    return this.homeCards.sections;
  }

  /**
   * Flattens the home cards manifest into the ordered sequence of routed
   * project pages (skipping externals like League Index) and returns the
   * neighbours for the current project plus the section it belongs to.
   * Used by project-detail for breadcrumbs and prev/next navigation.
   */
  getProjectNav(id: string): {
    prev?: { id: string; title: string };
    next?: { id: string; title: string };
    section?: string;
  } {
    const routed: { id: string; title: string; section: string }[] = [];
    for (const section of this.homeCards.sections) {
      for (const card of section.cards) {
        if (card.primaryLink.type !== 'route') continue;
        const targetId = card.primaryLink.target.replace(/^\/projects\//, '');
        routed.push({ id: targetId, title: card.title, section: section.heading });
      }
    }
    const idx = routed.findIndex((c) => c.id === id);
    if (idx === -1) return {};
    return {
      prev: idx > 0 ? { id: routed[idx - 1].id, title: routed[idx - 1].title } : undefined,
      next:
        idx < routed.length - 1
          ? { id: routed[idx + 1].id, title: routed[idx + 1].title }
          : undefined,
      section: routed[idx].section,
    };
  }
}
